FROM golang:1.23-alpine AS builder

WORKDIR /go/src/app
COPY . .

RUN apk add build-base
RUN go mod download
RUN CGO_ENABLED=1 GOOS=linux go build -o /go/bin/datum -a -ldflags '-linkmode external -extldflags "-static"' .

FROM gcr.io/distroless/static:nonroot

# `nonroot` coming from distroless
USER 65532:65532

# Copy the binary that goreleaser built
COPY --from=builder /go/bin/datum /bin/datum

# Copy default model into image
COPY fga/model/datum.fga fga/model/datum.fga

# Copy empty config to allow for environment only configuration
COPY config/config-empty.yaml config/.config.yaml

# Run the web service on container startup.
ENTRYPOINT [ "/bin/datum" ]
CMD ["serve"]
