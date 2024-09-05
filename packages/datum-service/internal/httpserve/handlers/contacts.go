package handlers

import (
	"fmt"
	"net/http"

	"github.com/datum-cloud/datum-os/internal/ent/generated"
	echo "github.com/datum-cloud/datum-os/pkg/echox"
	"github.com/datum-cloud/datum-os/pkg/middleware/transaction"
	"github.com/getkin/kin-openapi/openapi3"

	"github.com/datum-cloud/datum-os/pkg/models"
	"github.com/datum-cloud/datum-os/pkg/rout"
)

func (h *Handler) ContactsGet(ctx echo.Context) error {
	contacts, err := transaction.FromContext(ctx.Request().Context()).Contact.Query().All(ctx.Request().Context())
	if err != nil {
		return h.InternalServerError(ctx, err)
	}

	contactsGetResponse := models.ContactsGetResponseFromEntContacts(contacts)
	contactsGetResponse.Reply = rout.Reply{Success: true}
	out := contactsGetResponse

	return h.Success(ctx, out)
}

// BindContactsGet returns the OpenAPI3 operation for getting an orgs contacts'
func (h *Handler) BindContactsGet() *openapi3.Operation {
	contactsGet := openapi3.NewOperation()
	contactsGet.Description = "Get Contacts"
	contactsGet.OperationID = "ContactsGet"
	contactsGet.Security = &openapi3.SecurityRequirements{
		openapi3.SecurityRequirement{
			"bearerAuth": []string{},
		},
	}

	h.AddResponse("ContactsGetResponse", "success", models.ExampleContactsGetSuccessResponse, contactsGet, http.StatusOK)
	contactsGet.AddResponse(http.StatusInternalServerError, internalServerError())
	contactsGet.AddResponse(http.StatusUnauthorized, unauthorized())

	return contactsGet
}

<<<<<<< HEAD
func (h *Handler) ContactsPost() error {
	return nil
}
=======
func (h *Handler) ContactsPost(ctx echo.Context) error {
	contacts := models.ContactsPostRequest{}
	err := ctx.Bind(&contacts)
	if err != nil {
		return h.BadRequest(ctx, err)
	}

	createdContacts, err := transaction.FromContext(ctx.Request().Context()).
		Contact.
		MapCreateBulk(contacts.Contacts, func(builder *generated.ContactCreate, i int) {
		}).
		Save(ctx.Request().Context())
	if err != nil {
		return h.InternalServerError(ctx, err)
	}

	fmt.Println("created contacts", createdContacts)

	return nil
}

func (h *Handler) BindContactsPost() *openapi3.Operation {
	contactsPost := openapi3.NewOperation()
	contactsPost.Description = "Create Contacts"
	contactsPost.OperationID = "ContactsPost"
	contactsPost.Security = &openapi3.SecurityRequirements{
		openapi3.SecurityRequirement{
			"bearerAuth": []string{},
		},
	}

	// h.AddRequestBody("ContactsPostRequest", models.ExampleContactsPostRequest, contactsPost)

	// h.AddResponse("ContactsPostResponse", "success", models.ExampleContactsPostSuccessResponse, contactsPost, http.StatusOK)
	contactsPost.AddResponse(http.StatusInternalServerError, internalServerError())
	contactsPost.AddResponse(http.StatusUnauthorized, unauthorized())

	return contactsPost
}
>>>>>>> 066bd87d (Add ContactsPost handler stub. Add ContactsPostRequest model. Add BindContactsPost openapi spec. Add AllowIfOrgEditor authz check function.)
