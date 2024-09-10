package handlers

import (
	"net/http"
	"time"

	"github.com/datum-cloud/datum-os/internal/ent/generated"
	"github.com/datum-cloud/datum-os/internal/ent/generated/contact"
	"github.com/datum-cloud/datum-os/pkg/auth"
	echo "github.com/datum-cloud/datum-os/pkg/echox"
	"github.com/datum-cloud/datum-os/pkg/enums"
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

	contactsGetResponse := models.ContactsGetResponseFromGeneratedContacts(contacts)
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

func contactCreateFromContactData(cd *models.Contact, cc *generated.ContactCreate,
) *generated.ContactCreate {
	c := func(from string, to func(string)) {
		if len(from) > 0 {
			to(from)
		}
	}

	m := cc.Mutation()
	c(cd.FullName, m.SetFullName)
	c(cd.Title, m.SetTitle)
	c(cd.Company, m.SetCompany)
	c(cd.Email, m.SetEmail)
	c(cd.PhoneNumber, m.SetPhoneNumber)
	c(cd.Address, m.SetAddress)

	if len(cd.Status) > 0 {
		m.SetStatus(*enums.ToUserStatus(cd.Status))
	}

	return cc
}

func (h *Handler) ContactsPost(ctx echo.Context) error {
	contacts := models.ContactsPostRequest{}
	err := ctx.Bind(&contacts)
	if err != nil {
		return h.BadRequest(ctx, err)
	}

	createdContacts, err := transaction.FromContext(ctx.Request().Context()).
		Contact.
		MapCreateBulk(contacts.Contacts, func(builder *generated.ContactCreate, i int) {
			contactCreateFromContactData(&contacts.Contacts[i], builder)
		}).
		Save(ctx.Request().Context())
	if err != nil {
		return h.InternalServerError(ctx, err)
	}

	h.Logger.Debugf("Created Contacts, %s", createdContacts)

	return h.Created(ctx, models.ContactsGetResponseFromGeneratedContacts(createdContacts))
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

	h.AddRequestBody("ContactsPostRequest", models.ExampleContactsPostRequest, contactsPost)

	h.AddResponse("ContactsPostResponse", "success", models.ExampleContactsPostSuccessResponse, contactsPost, http.StatusOK)
	contactsPost.AddResponse(http.StatusBadRequest, badRequest())
	contactsPost.AddResponse(http.StatusInternalServerError, internalServerError())
	contactsPost.AddResponse(http.StatusUnauthorized, unauthorized())

	return contactsPost
}

func (h *Handler) ContactsPut(ctx echo.Context) error {
	contacts := models.ContactsPutRequest{}
	err := ctx.Bind(&contacts)
	if err != nil {
		return h.BadRequest(ctx, err)
	}

	tx := transaction.FromContext(ctx.Request().Context())
	updatedContacts := models.ContactsPutResponse{}
	for _, contact := range contacts.Contacts {
		updatedContact, err := tx.Contact.UpdateOneID(contact.ID).
			SetFullName(contact.FullName).
			SetTitle(contact.Title).
			SetCompany(contact.Company).
			SetEmail(contact.Email).
			SetPhoneNumber(contact.PhoneNumber).
			SetAddress(contact.Address).
			SetNillableStatus(enums.ToUserStatus(contact.Status)).
			Save(ctx.Request().Context())
		if err != nil {
			return h.InternalServerError(ctx, err)
		}

		h.Logger.Debugf("Updated Contact, %s", updatedContact)

		updatedContacts.Count += 1
		updatedContacts.Contacts = append(updatedContacts.Contacts, models.ContactFromGeneratedContact(updatedContact))
	}

	updatedContacts.Success = true
	return h.Success(ctx, updatedContacts)
}

func (h *Handler) BindContactsPut() *openapi3.Operation {
	contactsPut := openapi3.NewOperation()
	contactsPut.Description = "Update Contacts (Full Update)"
	contactsPut.OperationID = "ContactsPut"
	contactsPut.Security = &openapi3.SecurityRequirements{
		openapi3.SecurityRequirement{
			"bearerAuth": []string{},
		},
	}

	h.AddRequestBody("ContactsPutRequest", models.ExampleContactsPutRequest, contactsPut)

	h.AddResponse("ContactsPutResponse", "success", models.ExampleContactsPutSuccessResponse, contactsPut, http.StatusOK)
	contactsPut.AddResponse(http.StatusBadRequest, badRequest())
	contactsPut.AddResponse(http.StatusInternalServerError, internalServerError())
	contactsPut.AddResponse(http.StatusUnauthorized, unauthorized())

	return contactsPut
}

func (h *Handler) ContactsDelete(ctx echo.Context) error {
	IDs := models.ContactsDeleteRequest{}
	err := ctx.Bind(&IDs)
	if err != nil {
		return h.BadRequest(ctx, err)
	}

	deletedBy, err := auth.GetUserIDFromContext(ctx.Request().Context())
	if err != nil {
		return h.InternalServerError(ctx, err)
	}

	affected, err := transaction.FromContext(ctx.Request().Context()).Contact.Update().
		Where(contact.IDIn(IDs.ContactIDs...)).
		SetDeletedAt(time.Now()).
		SetDeletedBy(deletedBy).
		Save(ctx.Request().Context())
	if err != nil {
		return h.InternalServerError(ctx, err)
	}

	h.Logger.Debugf("Deleted %d Contacts, %s", affected, IDs)

	return h.Success(
		ctx,
		&models.ContactsDeleteResponse{
			Reply:         rout.Reply{Success: true},
			CountAffected: affected,
		},
	)
}

func (h *Handler) BindContactsDelete() *openapi3.Operation {
	contactsPost := openapi3.NewOperation()
	contactsPost.Description = "Delete Contacts"
	contactsPost.OperationID = "ContactsDelete"
	contactsPost.Security = &openapi3.SecurityRequirements{
		openapi3.SecurityRequirement{
			"bearerAuth": []string{},
		},
	}

	h.AddRequestBody("ContactsDeleteRequest", models.ExampleContactsDeleteRequest, contactsPost)

	h.AddResponse("ContactsDeleteResponse", "success", models.ExampleContactsDeleteSuccessResponse, contactsPost, http.StatusOK)
	contactsPost.AddResponse(http.StatusBadRequest, badRequest())
	contactsPost.AddResponse(http.StatusInternalServerError, internalServerError())
	contactsPost.AddResponse(http.StatusUnauthorized, unauthorized())

	return contactsPost
}
