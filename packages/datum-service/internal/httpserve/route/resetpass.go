package route

import (
	"net/http"

	"github.com/datum-cloud/datum-os/internal/httpserve/mw"
	echo "github.com/datum-cloud/datum-os/pkg/echox"
)

// registerResetPasswordHandler registers the reset password handler and route
func registerResetPasswordHandler(router *Router) (err error) {
	path := "/password-reset"
	method := http.MethodPost
	name := "ResetPassword"

	route := echo.Route{
		Name:        name,
		Method:      method,
		Path:        path,
		Middlewares: mw.GetMiddleware(),
		Handler: func(c echo.Context) error {
			return router.Handler.ResetPassword(c)
		},
	}

	resetOperation := router.Handler.BindResetPasswordHandler()

	if err := router.Addv1Route(path, method, resetOperation, route); err != nil {
		return err
	}

	return nil
}
