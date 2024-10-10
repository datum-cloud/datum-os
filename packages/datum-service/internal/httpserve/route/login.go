package route

import (
	"net/http"

	"github.com/datum-cloud/datum-os/internal/httpserve/mw"
	echo "github.com/datum-cloud/datum-os/pkg/echox"
)

// Login is oriented towards human users who use their email and password for
// authentication - see the handlers/login.go for more information
func registerLoginHandler(router *Router) (err error) {
	path := "/login"
	method := http.MethodPost
	name := "Login"

	route := echo.Route{
		Name:        name,
		Method:      method,
		Path:        path,
		Middlewares: mw.GetMiddleware(),
		Handler: func(c echo.Context) error {
			return router.Handler.LoginHandler(c)
		},
	}

	loginOperation := router.Handler.BindLoginHandler()

	if err := router.Addv1Route(path, method, loginOperation, route); err != nil {
		return err
	}

	return nil
}
