package handlers

import (
	"net/http"

	echo "github.com/datum-cloud/echox"
	"github.com/getkin/kin-openapi/openapi3"

	"github.com/datum-cloud/datum-os/pkg/auth"
	"github.com/datum-cloud/datum-os/pkg/middleware/transaction"
	"github.com/datum-cloud/datum-os/pkg/models"
	"github.com/datum-cloud/datum-os/pkg/rout"
)

func (h *Handler) ContactsGet(ctx echo.Context) error {
	reqCtx := ctx.Request().Context()

	orgID, err := auth.GetOrganizationIDFromContext(reqCtx)
	if err != nil {
		h.Logger.Errorw("unable to get org id from context", "error", err)

		return h.BadRequest(ctx, err)
	}
	h.Logger.Debugw("org id", "org", orgID)

	/*org*/
	_, err = transaction.FromContext(reqCtx).Organization.Get(reqCtx, orgID)
	if err != nil {
		h.Logger.Errorw("unable to get org from id", "error", err)
	}

	// contacts, err := transaction.FromContext(reqCtx).Organization.
	// 	QueryContacts(org).
	// 	Order(contact.ByFullName(sql.OrderAsc())).
	// h.Logger.Debug(contacts)

	// reply with the relevant details
	out := &models.ContactsGetResponse{
		Reply: rout.Reply{Success: true},
		Count: 1,
		Contacts: []models.ContactData{
			{
				FullName: "Aus",
			},
		},
	}

	return h.Created(ctx, out)
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
