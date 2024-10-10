package route

import (
	"net/http"

	"github.com/datum-cloud/datum-os/internal/httpserve/mw"
	echo "github.com/datum-cloud/datum-os/pkg/echox"
)

// registerInviteHandler registers the invite handler
func registerInviteHandler(router *Router) (err error) {
	path := "/invite"
	method := http.MethodGet
	name := "OrganizationInviteAccept"

	route := echo.Route{
		Name:        name,
		Method:      method,
		Path:        path,
		Middlewares: mw.GetAuthMiddleware(),
		Handler: func(c echo.Context) error {
			return router.Handler.OrganizationInviteAccept(c)
		},
	}

	inviteOperation := router.Handler.BindOrganizationInviteAccept()

	if err := router.Addv1Route(path, method, inviteOperation, route); err != nil {
		return err
	}

	return nil
}
