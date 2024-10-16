package middleware

import (
	"bufio"
	"bytes"
	"compress/gzip"
	"errors"
	"io"
	"net"
	"net/http"
	"strings"
	"sync"

	"github.com/datum-cloud/datum-os/pkg/echox"
)

const (
	gzipScheme = "gzip"
)

// GzipConfig defines the config for Gzip middleware.
type GzipConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// Gzip compression level.
	// Optional. Default value -1.
	Level int

	// Length threshold before gzip compression is applied.
	// Optional. Default value 0.
	//
	// Most of the time you will not need to change the default. Compressing
	// a short response might increase the transmitted data because of the
	// gzip format overhead. Compressing the response will also consume CPU
	// and time on the server and the client (for decompressing). Depending on
	// your use case such a threshold might be useful.
	//
	// See also:
	// https://webmasters.stackexchange.com/questions/31750/what-is-recommended-minimum-object-size-for-gzip-performance-benefits
	MinLength int
}

type gzipResponseWriter struct {
	io.Writer
	http.ResponseWriter
	wroteHeader       bool
	wroteBody         bool
	minLength         int
	minLengthExceeded bool
	buffer            *bytes.Buffer
	code              int
}

// Gzip returns a middleware which compresses HTTP response using gzip compression scheme.
func Gzip() echox.MiddlewareFunc {
	return GzipWithConfig(GzipConfig{})
}

// GzipWithConfig returns a middleware which compresses HTTP response using gzip compression scheme.
func GzipWithConfig(config GzipConfig) echox.MiddlewareFunc {
	return toMiddlewareOrPanic(config)
}

// ToMiddleware converts GzipConfig to middleware or returns an error for invalid configuration
func (config GzipConfig) ToMiddleware() (echox.MiddlewareFunc, error) {
	if config.Skipper == nil {
		config.Skipper = DefaultSkipper
	}

	if config.Level < -2 || config.Level > 9 { // these are consts: gzip.HuffmanOnly and gzip.BestCompression
		return nil, errors.New("invalid gzip level")
	}

	if config.Level == 0 {
		config.Level = -1
	}

	if config.MinLength < 0 {
		config.MinLength = 0
	}

	pool := gzipCompressPool(config)
	bpool := bufferPool()

	return func(next echox.HandlerFunc) echox.HandlerFunc {
		return func(c echox.Context) error {
			if config.Skipper(c) {
				return next(c)
			}

			res := c.Response()
			res.Header().Add(echox.HeaderVary, echox.HeaderAcceptEncoding)

			if strings.Contains(c.Request().Header.Get(echox.HeaderAcceptEncoding), gzipScheme) {
				i := pool.Get()
				w, ok := i.(*gzip.Writer)

				if !ok {
					return echox.NewHTTPErrorWithInternal(http.StatusInternalServerError, i.(error))
				}

				rw := res.Writer
				w.Reset(rw)

				buf := bpool.Get().(*bytes.Buffer)
				buf.Reset()

				grw := &gzipResponseWriter{Writer: w, ResponseWriter: rw, minLength: config.MinLength, buffer: buf}
				defer func() {
					// There are different reasons for cases when we have not yet written response to the client and now need to do so.
					// a) handler response had only response code and no response body (ala 404 or redirects etc). Response code need to be written now.
					// b) body is shorter than our minimum length threshold and being buffered currently and needs to be written
					if !grw.wroteBody {
						if res.Header().Get(echox.HeaderContentEncoding) == gzipScheme {
							res.Header().Del(echox.HeaderContentEncoding)
						}

						if grw.wroteHeader {
							rw.WriteHeader(grw.code)
						}
						// We have to reset response to it's pristine state when
						// nothing is written to body or error is returned.
						// See issue #424, #407.
						res.Writer = rw

						w.Reset(io.Discard)
					} else if !grw.minLengthExceeded {
						// Write uncompressed response
						res.Writer = rw

						if grw.wroteHeader {
							grw.ResponseWriter.WriteHeader(grw.code)
						}

						grw.buffer.WriteTo(rw) // nolint: errcheck
						w.Reset(io.Discard)
					}

					w.Close()
					bpool.Put(buf)
					pool.Put(w)
				}()

				res.Writer = grw
			}

			return next(c)
		}
	}, nil
}

func (w *gzipResponseWriter) WriteHeader(code int) {
	w.Header().Del(echox.HeaderContentLength) // Issue #444

	w.wroteHeader = true

	// Delay writing of the header until we know if we'll actually compress the response
	w.code = code
}

func (w *gzipResponseWriter) Write(b []byte) (int, error) {
	if w.Header().Get(echox.HeaderContentType) == "" {
		w.Header().Set(echox.HeaderContentType, http.DetectContentType(b))
	}

	w.wroteBody = true

	if !w.minLengthExceeded {
		n, err := w.buffer.Write(b)

		if w.buffer.Len() >= w.minLength {
			w.minLengthExceeded = true

			// The minimum length is exceeded, add Content-Encoding header and write the header
			w.Header().Set(echox.HeaderContentEncoding, gzipScheme) // Issue #806

			if w.wroteHeader {
				w.ResponseWriter.WriteHeader(w.code)
			}

			return w.Writer.Write(w.buffer.Bytes())
		}

		return n, err
	}

	return w.Writer.Write(b)
}

func (w *gzipResponseWriter) Flush() {
	if !w.minLengthExceeded {
		// Enforce compression because we will not know how much more data will come
		w.minLengthExceeded = true
		w.Header().Set(echox.HeaderContentEncoding, gzipScheme) // Issue #806

		if w.wroteHeader {
			w.ResponseWriter.WriteHeader(w.code)
		}

		w.Writer.Write(w.buffer.Bytes()) // nolint: errcheck
	}

	w.Writer.(*gzip.Writer).Flush()

	if flusher, ok := w.ResponseWriter.(http.Flusher); ok {
		flusher.Flush()
	}
}

func (w *gzipResponseWriter) Hijack() (net.Conn, *bufio.ReadWriter, error) {
	return w.ResponseWriter.(http.Hijacker).Hijack()
}

func (w *gzipResponseWriter) Push(target string, opts *http.PushOptions) error {
	if p, ok := w.ResponseWriter.(http.Pusher); ok {
		return p.Push(target, opts)
	}

	return http.ErrNotSupported
}

func gzipCompressPool(config GzipConfig) sync.Pool {
	return sync.Pool{
		New: func() interface{} {
			w, err := gzip.NewWriterLevel(io.Discard, config.Level)
			if err != nil {
				return err
			}
			return w
		},
	}
}

func bufferPool() sync.Pool {
	return sync.Pool{
		New: func() interface{} {
			b := &bytes.Buffer{}
			return b
		},
	}
}
