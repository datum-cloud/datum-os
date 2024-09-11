package route

import (
	"net/http"

	echo "github.com/datum-cloud/datum-os/pkg/echox"
)

// registerContactsGetHandlers registers the contacts endpoint handlers
func registerContactsHandlers(router *Router) (err error) {
	path := "/contacts"
	name := "Contacts"

	routeGet := echo.Route{
		Name:        name + "Get",
		Method:      http.MethodGet,
		Path:        path,
		Middlewares: authMW,
		Handler: func(c echo.Context) error {
			return router.Handler.ContactsGet(c)
		},
	}

	if err := router.Addv1Route(
		path, routeGet.Method, router.Handler.BindContactsGet(), routeGet,
	); err != nil {
		return err
	}

	routePost := echo.Route{
		Name:        name + "Post",
		Method:      http.MethodPost,
		Path:        path,
		Middlewares: authMW,
		Handler: func(c echo.Context) error {
			return router.Handler.ContactsPost(c)
		},
	}

	if err = router.Addv1Route(
		path, routePost.Method, router.Handler.BindContactsPost(), routePost,
	); err != nil {
		return err
	}

	routePut := echo.Route{
		Name:        name + "Put",
		Method:      http.MethodPut,
		Path:        path,
		Middlewares: authMW,
		Handler: func(c echo.Context) error {
			return router.Handler.ContactsPut(c)
		},
	}

	if err = router.Addv1Route(
		path, routePut.Method, router.Handler.BindContactsPut(), routePut,
	); err != nil {
		return err
	}

	routeDelete := echo.Route{
		Name:        name + "Delete",
		Method:      http.MethodDelete,
		Path:        path,
		Middlewares: authMW,
		Handler: func(c echo.Context) error {
			return router.Handler.ContactsDelete(c)
		},
	}

	if err = router.Addv1Route(
		path, routePost.Method, router.Handler.BindContactsDelete(), routeDelete,
	); err != nil {
		return err
	}

	return nil
}
