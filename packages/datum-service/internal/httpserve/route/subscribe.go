package route

import (
	"net/http"

	"github.com/datum-cloud/datum-os/internal/httpserve/mw"
	echo "github.com/datum-cloud/datum-os/pkg/echox"
)

// registerVerifySubscribeHandler registers the verify subscription handler and route
func registerVerifySubscribeHandler(router *Router) (err error) {
	path := "/subscribe/verify"
	method := http.MethodGet
	name := "VerifySubscription"

	route := echo.Route{
		Name:        name,
		Method:      method,
		Path:        path,
		Middlewares: mw.GetRestrictedEndpointsMiddleware(),
		Handler: func(c echo.Context) error {
			return router.Handler.VerifySubscriptionHandler(c)
		},
	}

	subscribeOperation := router.Handler.BindVerifySubscriberHandler()

	if err := router.Addv1Route(path, method, subscribeOperation, route); err != nil {
		return err
	}

	return nil
}
