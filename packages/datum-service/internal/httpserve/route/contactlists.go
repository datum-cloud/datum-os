package route

import (
	"net/http"

	echo "github.com/datum-cloud/datum-os/pkg/echox"
)

// registerContactListsHandlers registers the contacts endpoint handlers
func registerContactListsHandlers(router *Router) (err error) {
	path := "/contacts/lists"
	name := "Contact Lists "

	routeGet := echo.Route{
		Name:        name + "Get",
		Method:      http.MethodGet,
		Path:        path,
		Middlewares: authMW,
		Handler: func(c echo.Context) error {
			return router.Handler.ContactListsGet(c)
		},
	}

	if err := router.Addv1Route(
		path, routeGet.Method, router.Handler.BindContactListsGet(), routeGet,
	); err != nil {
		return err
	}

	routeGetOne := echo.Route{
		Name:        name + "GetOne",
		Method:      http.MethodGet,
		Path:        path + "/:id",
		Middlewares: authMW,
		Handler: func(c echo.Context) error {
			return router.Handler.ContactListsGetOne(c)
		},
	}

	if err := router.Addv1Route(
		path, routeGetOne.Method, router.Handler.BindContactListsGetOne(), routeGetOne,
	); err != nil {
		return err
	}

	routePost := echo.Route{
		Name:        name + "Post",
		Method:      http.MethodPost,
		Path:        path,
		Middlewares: authMW,
		Handler: func(c echo.Context) error {
			return router.Handler.ContactListsPost(c)
		},
	}

	if err = router.Addv1Route(
		path, routePost.Method, router.Handler.BindContactListsPost(), routePost,
	); err != nil {
		return err
	}

	routePut := echo.Route{
		Name:        name + "Put",
		Method:      http.MethodPut,
		Path:        path,
		Middlewares: authMW,
		Handler: func(c echo.Context) error {
			return router.Handler.ContactListsPut(c)
		},
	}

	if err = router.Addv1Route(
		path, routePut.Method, router.Handler.BindContactListsPut(), routePut,
	); err != nil {
		return err
	}

	routeDelete := echo.Route{
		Name:        name + "Delete",
		Method:      http.MethodDelete,
		Path:        path,
		Middlewares: authMW,
		Handler: func(c echo.Context) error {
			return router.Handler.ContactListsDelete(c)
		},
	}

	if err = router.Addv1Route(
		path, routeDelete.Method, router.Handler.BindContactListsDelete(), routeDelete,
	); err != nil {
		return err
	}

	routeMembersGet := echo.Route{
		Name:        name + "Members Get",
		Method:      http.MethodGet,
		Path:        path + "/:id/members",
		Middlewares: authMW,
		Handler: func(c echo.Context) error {
			return router.Handler.ContactListsMembersGet(c)
		},
	}

	if err = router.Addv1Route(
		path, routeMembersGet.Method, router.Handler.BindContactListsMembersGet(), routeMembersGet,
	); err != nil {
		return err
	}

	routeMembersPost := echo.Route{
		Name:        name + "Members Post",
		Method:      http.MethodPost,
		Path:        path + "/:id/members",
		Middlewares: authMW,
		Handler: func(c echo.Context) error {
			return router.Handler.ContactListsMembersPost(c)
		},
	}

	if err = router.Addv1Route(
		path, routeMembersPost.Method, router.Handler.BindContactListsMembersPost(), routeMembersPost,
	); err != nil {
		return err
	}

	return nil
}
