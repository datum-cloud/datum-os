package route

import (
	"net/http"

	"github.com/datum-cloud/datum-os/internal/httpserve/mw"
	echo "github.com/datum-cloud/datum-os/pkg/echox"
)

// registerRegisterHandler registers the register handler and route
func registerRegisterHandler(router *Router) (err error) {
	path := "/register"
	method := http.MethodPost
	name := "Register"

	route := echo.Route{
		Name:        name,
		Method:      method,
		Path:        path,
		Middlewares: mw.GetRestrictedEndpointsMiddleware(),
		Handler: func(c echo.Context) error {
			return router.Handler.RegisterHandler(c)
		},
	}

	registerOperation := router.Handler.BindRegisterHandler()

	if err := router.Addv1Route(path, method, registerOperation, route); err != nil {
		return err
	}

	return nil
}
