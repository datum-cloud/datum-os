package route

import (
	"net/http"

	"github.com/datum-cloud/datum-os/internal/httpserve/mw"
	echo "github.com/datum-cloud/datum-os/pkg/echox"
)

// registerAccountRolesHandler registers the /account/roles handler
func registerAccountRolesHandler(router *Router) (err error) {
	path := "/account/roles"
	method := http.MethodPost
	name := "AccountRoles"

	route := echo.Route{
		Name:        name,
		Method:      method,
		Path:        path,
		Middlewares: mw.GetAuthMiddleware(),
		Handler: func(c echo.Context) error {
			return router.Handler.AccountRolesHandler(c)
		},
	}

	rolesOperation := router.Handler.BindAccountRoles()

	if err := router.Addv1Route(path, method, rolesOperation, route); err != nil {
		return err
	}

	return nil
}
