package mw

import (
	"time"

	"github.com/datum-cloud/datum-os/internal/httpserve/handlers"
	echo "github.com/datum-cloud/datum-os/pkg/echox"
	"github.com/datum-cloud/datum-os/pkg/echox/middleware"
	"github.com/datum-cloud/datum-os/pkg/middleware/ratelimit"
	"github.com/datum-cloud/datum-os/pkg/middleware/transaction"
)

var (
	mw     = []echo.MiddlewareFunc{middleware.Recover()}
	authMW = []echo.MiddlewareFunc{}

	restrictedRateLimit   = &ratelimit.Config{RateLimit: 10, BurstLimit: 10, ExpiresIn: 15 * time.Minute} //nolint:mnd
	restrictedEndpointsMW = []echo.MiddlewareFunc{}
)

func InitMiddleware(handler *handlers.Handler) {
	// add transaction middleware
	transactionConfig := transaction.Client{
		EntDBClient: handler.DBClient,
		Logger:      handler.Logger,
	}

	mw = append(mw, transactionConfig.Middleware)

	// Middleware for restricted endpoints
	restrictedEndpointsMW = append(restrictedEndpointsMW, mw...)
	restrictedEndpointsMW = append(restrictedEndpointsMW, ratelimit.RateLimiterWithConfig(restrictedRateLimit)) // add restricted ratelimit middleware

	// Middleware for authenticated endpoints
	authMW = append(authMW, mw...)
	authMW = append(authMW, handler.AuthMiddleware...)
}

func GetMiddleware() []echo.MiddlewareFunc {
	return mw
}

func GetAuthMiddleware() []echo.MiddlewareFunc {
	return authMW
}

func GetRestrictedEndpointsMiddleware() []echo.MiddlewareFunc {
	return restrictedEndpointsMW
}
