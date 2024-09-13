package handlers

import (
	"net/http"

	"github.com/datum-cloud/datum-os/internal/ent/generated"
	echo "github.com/datum-cloud/datum-os/pkg/echox"
	"github.com/datum-cloud/datum-os/pkg/enums"
	"github.com/datum-cloud/datum-os/pkg/models"
	"github.com/getkin/kin-openapi/openapi3"
)

func (h *Handler) ContactListsGet(ctx echo.Context) error {
	// contacts, err := transaction.FromContext(ctx.Request().Context()).Contact.Query().All(ctx.Request().Context())
	// if err != nil {
	// 	return h.InternalServerError(ctx, err)
	// }

	// contactsGetResponse := models.ContactsGetResponseFromGeneratedContacts(contacts)
	// contactsGetResponse.Reply = rout.Reply{Success: true}

	// return h.Success(ctx, contactsGetResponse)
	return nil
}

// BindContactsGet returns the OpenAPI3 operation for getting an orgs contacts'
func (h *Handler) BindContactListsGet() *openapi3.Operation {
	contactListsGet := openapi3.NewOperation()
	contactListsGet.Description = "Get Contact Lists"
	contactListsGet.OperationID = "ContactListsGet"
	contactListsGet.Security = &openapi3.SecurityRequirements{
		openapi3.SecurityRequirement{
			"bearerAuth": []string{},
		},
	}

	// h.AddResponse("ContactListsGetResponse", "success", models.ExampleContactListsGetSuccessResponse, contactListsGet, http.StatusOK)
	contactListsGet.AddResponse(http.StatusInternalServerError, internalServerError())
	contactListsGet.AddResponse(http.StatusUnauthorized, unauthorized())

	return contactListsGet
}

func (h *Handler) ContactListsGetOne(ctx echo.Context) error {
	// contactListsGetOneReq := models.ContactListsGetOneRequest{}
	// if err := ctx.Bind(&contactListsGetOneReq); err != nil {
	// 	return h.BadRequest(ctx, err)
	// }

	// contactList, err := transaction.FromContext(ctx.Request().Context()).
	// 	Contact.Get(ctx.Request().Context(), contactListsGetOneReq.ID)
	// if err != nil {
	// 	return h.InternalServerError(ctx, err)
	// }

	// contactListsGetOneResponse := models.ContactListsGetOneResponseFromGeneratedContact(contact)

	// return h.Success(ctx, contactListsGetOneResponse)
	return nil
}

func (h *Handler) BindContactListsGetOne() *openapi3.Operation {
	contactListsGetOne := openapi3.NewOperation()
	contactListsGetOne.Description = "Get One Contact List"
	contactListsGetOne.OperationID = "ContactListsGetOne"
	contactListsGetOne.Security = &openapi3.SecurityRequirements{
		openapi3.SecurityRequirement{
			"bearerAuth": []string{},
		},
	}

	// h.AddResponse("ContactListsGetOneResponse", "success", models.ExampleContactListsGetOneSuccessResponse, contactlistsGetOne, http.StatusOK)
	contactListsGetOne.AddResponse(http.StatusBadRequest, badRequest())
	contactListsGetOne.AddResponse(http.StatusInternalServerError, internalServerError())
	contactListsGetOne.AddResponse(http.StatusUnauthorized, unauthorized())

	return contactListsGetOne
}

func contactListCreateFromContactListData(cd *models.Contact, cc *generated.ContactCreate,
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

func (h *Handler) ContactListsPost(ctx echo.Context) error {
	// contactLists := models.ContactListsPostRequest{}
	// err := ctx.Bind(&contactLists)
	// if err != nil {
	// 	return h.BadRequest(ctx, err)
	// }

	// createdContactLists, err := transaction.FromContext(ctx.Request().Context()).
	// 	Contact.
	// 	MapCreateBulk(contactLists.Contacts, func(builder *generated.ContactListsCreate, i int) {
	// 		contactListCreateFromContactListData(&contactLists.Contacts[i], builder)
	// 	}).
	// 	Save(ctx.Request().Context())
	// if err != nil {
	// 	return h.InternalServerError(ctx, err)
	// }

	// h.Logger.Debugf("Created Contact Lists, %s", createdContactLists)

	// return h.Created(ctx, models.ContactsGetResponseFromGeneratedContacts(createdContacts))
	return nil
}

func (h *Handler) BindContactListsPost() *openapi3.Operation {
	contactsPost := openapi3.NewOperation()
	contactsPost.Description = "Create Contact Lists"
	contactsPost.OperationID = "ContactListsPost"
	contactsPost.Security = &openapi3.SecurityRequirements{
		openapi3.SecurityRequirement{
			"bearerAuth": []string{},
		},
	}

	// h.AddRequestBody("ContactListsPostRequest", models.ExampleContactListsPostRequest, contactsPost)

	// h.AddResponse("ContactListsPostResponse", "success", models.ExampleContactsPostSuccessResponse, contactsPost, http.StatusOK)
	contactsPost.AddResponse(http.StatusBadRequest, badRequest())
	contactsPost.AddResponse(http.StatusInternalServerError, internalServerError())
	contactsPost.AddResponse(http.StatusUnauthorized, unauthorized())

	return contactsPost
}

func (h *Handler) ContactListsPut(ctx echo.Context) error {
	// contactLists := models.ContactListsPutRequest{}
	// err := ctx.Bind(&contactLists)
	// if err != nil {
	// 	return h.BadRequest(ctx, err)
	// }

	// tx := transaction.FromContext(ctx.Request().Context())
	// updatedContactLists := models.ContactListsPutResponse{}
	// for _, contact := range contactLists.Contacts {
	// 	updatedContactList, err := tx.ContactList.UpdateOneID(contact.ID).
	// 		SetFullName(contact.FullName).
	// 		SetTitle(contact.Title).
	// 		SetCompany(contact.Company).
	// 		SetEmail(contact.Email).
	// 		SetPhoneNumber(contact.PhoneNumber).
	// 		SetAddress(contact.Address).
	// 		SetNillableStatus(enums.ToUserStatus(contact.Status)).
	// 		Save(ctx.Request().Context())
	// 	if err != nil {
	// 		return h.InternalServerError(ctx, err)
	// 	}

	// 	h.Logger.Debugf("Updated Contact, %s", updatedContactList)

	// 	updatedContactLists.Count += 1
	// 	updatedContactLists.Contacts = append(updatedContactLists.Contacts, models.ContactFromGeneratedContact(updatedContactList))
	// }

	// updatedContactLists.Success = true
	// return h.Success(ctx, updatedContactLists)
	return nil
}

func (h *Handler) BindContactListsPut() *openapi3.Operation {
	contactListsPut := openapi3.NewOperation()
	contactListsPut.Description = "Update Contact Lists (Full Update)"
	contactListsPut.OperationID = "ContactListsPut"
	contactListsPut.Security = &openapi3.SecurityRequirements{
		openapi3.SecurityRequirement{
			"bearerAuth": []string{},
		},
	}

	// h.AddRequestBody("ContactListsPutRequest", models.ExampleContactListsPutRequest, contactListsPut)

	// h.AddResponse("ContactsPutResponse", "success", models.ExampleContactListsPutSuccessResponse, contactListsPut, http.StatusOK)
	contactListsPut.AddResponse(http.StatusBadRequest, badRequest())
	contactListsPut.AddResponse(http.StatusInternalServerError, internalServerError())
	contactListsPut.AddResponse(http.StatusUnauthorized, unauthorized())

	return contactListsPut
}

func (h *Handler) ContactListsDelete(ctx echo.Context) error {
	// IDs := models.ContactListsDeleteRequest{}
	// err := ctx.Bind(&IDs)
	// if err != nil {
	// 	return h.BadRequest(ctx, err)
	// }

	// affected, err := transaction.FromContext(ctx.Request().Context()).Contact.Delete().
	// 	Where(contact.IDIn(IDs.ContactIDs...)).
	// 	Exec(ctx.Request().Context())
	// if err != nil {
	// 	return h.InternalServerError(ctx, err)
	// }

	// h.Logger.Debugf("Deleted %d Contacts, %s", affected, IDs)

	// return h.Success(
	// 	ctx,
	// 	&models.ContactListsDeleteResponse{
	// 		Reply:         rout.Reply{Success: true},
	// 		CountAffected: affected,
	// 	},
	// )

	return nil
}

func (h *Handler) BindContactListsDelete() *openapi3.Operation {
	contactListsDelete := openapi3.NewOperation()
	contactListsDelete.Description = "Delete Contact Lists"
	contactListsDelete.OperationID = "ContactListsDelete"
	contactListsDelete.Security = &openapi3.SecurityRequirements{
		openapi3.SecurityRequirement{
			"bearerAuth": []string{},
		},
	}

	// h.AddRequestBody("ContactListsDeleteRequest", models.ExampleContactListsDeleteRequest, contactListsDelete)

	// h.AddResponse("ContactListsDeleteResponse", "success", models.ExampleContactListsDeleteSuccessResponse, contactListsDelete, http.StatusOK)
	contactListsDelete.AddResponse(http.StatusBadRequest, badRequest())
	contactListsDelete.AddResponse(http.StatusInternalServerError, internalServerError())
	contactListsDelete.AddResponse(http.StatusUnauthorized, unauthorized())

	return contactListsDelete
}
