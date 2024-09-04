package handlers

import (
	"net/http"

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

// BindOrganizationInviteAccept returns the OpenAPI3 operation for accepting an organization invite
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

func (h *Handler) ContactsPost() error {
	return nil
}
