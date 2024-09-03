package route

import (
	"net/http"

	echo "github.com/datum-cloud/datum-os/pkg/echox"
)

// registerEventPublisher registers the event publisher endpoint
func registerContactsGetHandler(router *Router) (err error) {
	path := "/contacts"
	method := http.MethodGet
	name := "ContactsGet"

	route := echo.Route{
		Name:        name,
		Method:      method,
		Path:        path,
		Middlewares: authMW,
		Handler: func(c echo.Context) error {
			return router.Handler.ContactsGet(c)
		},
	}

	eventOperation := router.Handler.BindContactsGet()

	if err := router.Addv1Route(path, method, eventOperation, route); err != nil {
		return err
	}

	return nil
}
