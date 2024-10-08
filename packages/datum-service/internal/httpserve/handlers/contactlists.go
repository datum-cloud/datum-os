package handlers

import (
	"net/http"

	"github.com/datum-cloud/datum-os/internal/ent/generated"
	"github.com/datum-cloud/datum-os/internal/ent/generated/contact"
	"github.com/datum-cloud/datum-os/internal/ent/generated/contactlist"
	"github.com/datum-cloud/datum-os/internal/ent/generated/contactlistmembership"
	echo "github.com/datum-cloud/datum-os/pkg/echox"
	"github.com/datum-cloud/datum-os/pkg/middleware/transaction"
	"github.com/datum-cloud/datum-os/pkg/models"
	"github.com/datum-cloud/datum-os/pkg/rout"
	"github.com/getkin/kin-openapi/openapi3"
)

func (h *Handler) ContactListsGet(ctx echo.Context) error {
	contactLists, err := transaction.FromContext(ctx.Request().Context()).
		ContactList.Query().
		All(ctx.Request().Context())
	if err != nil {
		return h.InternalServerError(ctx, err)
	}

	contactListsGetResponse := models.ContactListsGetResponseFromGeneratedContacts(contactLists)

	for i := range contactListsGetResponse.ContactLists {
		count, err := transaction.FromContext(ctx.Request().Context()).
			ContactListMembership.Query().
			Where(contactlistmembership.ContactListID(contactListsGetResponse.ContactLists[i].ID)).
			Count(ctx.Request().Context())
		if err != nil {
			return h.InternalServerError(ctx, err)
		}
		contactListsGetResponse.ContactLists[i].MemberCount = &count
	}

	return h.Success(ctx, contactListsGetResponse)
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

	h.AddResponse("ContactListsGetResponse", "success", models.ExampleContactListsGetSuccessResponse, contactListsGet, http.StatusOK)
	contactListsGet.AddResponse(http.StatusInternalServerError, internalServerError())
	contactListsGet.AddResponse(http.StatusUnauthorized, unauthorized())

	return contactListsGet
}

func (h *Handler) ContactListsGetOne(ctx echo.Context) error {
	contactListsGetOneReq := models.ContactListsGetOneRequest{}
	if err := ctx.Bind(&contactListsGetOneReq); err != nil {
		return h.BadRequest(ctx, err)
	}

	contactList, err := transaction.FromContext(ctx.Request().Context()).
		ContactList.Query().
		Where(contactlist.ID(contactListsGetOneReq.ID)).
		WithContactListMembers(func(q *generated.ContactListMembershipQuery) {
			q.Where(contactlistmembership.DeletedAtIsNil())
			q.WithContact(func(q *generated.ContactQuery) {
				q.Where(contact.DeletedAtIsNil())
			})
		}).
		Only(ctx.Request().Context())
	if err != nil {
		return h.InternalServerError(ctx, err)
	}

	contactListsGetOneResponse := models.ContactListsGetOneResponseFromGeneratedContactList(contactList)

	count := len(contactList.Edges.ContactListMembers)
	contactListsGetOneResponse.ContactList.MemberCount = &count

	return h.Success(ctx, contactListsGetOneResponse)
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

	h.AddResponse("ContactListsGetOneResponse", "success", models.ExampleContactListsGetOneSuccessResponse, contactListsGetOne, http.StatusOK)
	contactListsGetOne.AddResponse(http.StatusBadRequest, badRequest())
	contactListsGetOne.AddResponse(http.StatusInternalServerError, internalServerError())
	contactListsGetOne.AddResponse(http.StatusUnauthorized, unauthorized())

	return contactListsGetOne
}

func contactListCreateFromContactListData(cd *models.ContactList, cc *generated.ContactListCreate,
) *generated.ContactListCreate {
	c := func(from string, to func(string)) {
		if len(from) > 0 {
			to(from)
		}
	}

	m := cc.Mutation()
	c(cd.Name, m.SetName)
	c(cd.Visibility, m.SetVisibility)
	c(cd.DisplayName, m.SetDisplayName)
	c(cd.Description, m.SetDescription)

	return cc
}

func (h *Handler) ContactListsPost(ctx echo.Context) error {
	contactLists := models.ContactListsPostRequest{}
	err := ctx.Bind(&contactLists)
	if err != nil {
		return h.BadRequest(ctx, err)
	}

	createdContactLists, err := transaction.FromContext(ctx.Request().Context()).
		ContactList.
		MapCreateBulk(contactLists.ContactLists, func(builder *generated.ContactListCreate, i int) {
			contactListCreateFromContactListData(&contactLists.ContactLists[i], builder)
		}).
		Save(ctx.Request().Context())
	if err != nil {
		return h.InternalServerError(ctx, err)
	}

	h.Logger.Debugf("Created Contact Lists, %s", createdContactLists)

	return h.Created(ctx, models.ContactListsGetResponseFromGeneratedContacts(createdContactLists))
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

	h.AddRequestBody("ContactListsPostRequest", models.ExampleContactListsPostRequest, contactsPost)

	h.AddResponse("ContactListsPostResponse", "success", models.ExampleContactsPostSuccessResponse, contactsPost, http.StatusOK)
	contactsPost.AddResponse(http.StatusBadRequest, badRequest())
	contactsPost.AddResponse(http.StatusInternalServerError, internalServerError())
	contactsPost.AddResponse(http.StatusUnauthorized, unauthorized())

	return contactsPost
}

func (h *Handler) ContactListsPut(ctx echo.Context) error {
	contactListsPutReq := models.ContactListsPutRequest{}
	if err := ctx.Bind(&contactListsPutReq); err != nil {
		return h.BadRequest(ctx, err)
	}

	tx := transaction.FromContext(ctx.Request().Context())
	updatedContactLists := models.ContactListsPutResponse{}
	for _, contactList := range contactListsPutReq.ContactLists {
		updatedContactList, err := tx.ContactList.UpdateOneID(contactList.ID).
			SetName(contactList.Name).
			SetVisibility(contactList.Visibility).
			SetDisplayName(contactList.DisplayName).
			SetDescription(contactList.Description).
			Save(ctx.Request().Context())
		if err != nil {
			return h.InternalServerError(ctx, err)
		}

		h.Logger.Debugf("Updated ContactList, %s", updatedContactList)

		updatedContactLists.Count += 1
		updatedContactLists.ContactLists = append(updatedContactLists.ContactLists, models.ContactListFromGeneratedContactList(updatedContactList))
	}

	updatedContactLists.Success = true

	h.Logger.Debugf("Updated ContactLists, %s", updatedContactLists)

	return h.Success(ctx, updatedContactLists)
}

func (h *Handler) BindContactListsPut() *openapi3.Operation {
	contactListsPut := openapi3.NewOperation()
	contactListsPut.Description = "Update Contact Lists"
	contactListsPut.OperationID = "ContactListsPut"
	contactListsPut.Security = &openapi3.SecurityRequirements{
		openapi3.SecurityRequirement{
			"bearerAuth": []string{},
		},
	}

	h.AddRequestBody("ContactListsPutRequest", models.ExampleContactListsPutRequest, contactListsPut)

	h.AddResponse("ContactListsPutResponse", "success", models.ExampleContactListsPutSuccessResponse, contactListsPut, http.StatusOK)
	contactListsPut.AddResponse(http.StatusBadRequest, badRequest())
	contactListsPut.AddResponse(http.StatusInternalServerError, internalServerError())
	contactListsPut.AddResponse(http.StatusUnauthorized, unauthorized())

	return contactListsPut
}

func (h *Handler) ContactListsPutOne(ctx echo.Context) error {
	contactListsPutReq := models.ContactListsPutOneRequest{}
	if err := ctx.Bind(&contactListsPutReq); err != nil {
		return h.BadRequest(ctx, err)
	}

	contactList, err := transaction.FromContext(ctx.Request().Context()).
		ContactList.UpdateOneID(contactListsPutReq.ContactListID).
		SetName(contactListsPutReq.ContactList.Name).
		SetVisibility(contactListsPutReq.ContactList.Visibility).
		SetDisplayName(contactListsPutReq.ContactList.DisplayName).
		SetDescription(contactListsPutReq.ContactList.Description).
		Save(ctx.Request().Context())
	if err != nil {
		return h.InternalServerError(ctx, err)
	}

	h.Logger.Debugf("Updated ContactList, %s", contactList)

	return h.Success(ctx, models.ContactListsPutOneResponse{
		Reply:       rout.Reply{Success: true},
		ContactList: models.ContactListFromGeneratedContactList(contactList),
	})
}

func (h *Handler) BindContactListsPutOne() *openapi3.Operation {
	contactListsPutOne := openapi3.NewOperation()
	contactListsPutOne.Description = "Update One Contact List (Full Update)"
	contactListsPutOne.OperationID = "ContactListsPutOne"
	contactListsPutOne.Security = &openapi3.SecurityRequirements{
		openapi3.SecurityRequirement{
			"bearerAuth": []string{},
		},
	}

	h.AddRequestBody("ContactListsPutOneRequest", models.ExampleContactListsPutOneRequest, contactListsPutOne)

	h.AddResponse("ContactListsPutOneResponse", "success", models.ExampleContactListsPutOneSuccessResponse, contactListsPutOne, http.StatusOK)
	contactListsPutOne.AddResponse(http.StatusBadRequest, badRequest())
	contactListsPutOne.AddResponse(http.StatusInternalServerError, internalServerError())
	contactListsPutOne.AddResponse(http.StatusUnauthorized, unauthorized())

	return contactListsPutOne
}

func (h *Handler) ContactListsDelete(ctx echo.Context) error {
	IDs := models.ContactListsDeleteRequest{}
	err := ctx.Bind(&IDs)
	if err != nil {
		return h.BadRequest(ctx, err)
	}

	tx := transaction.FromContext(ctx.Request().Context())

	_, err = tx.ContactListMembership.Delete().
		Where(contactlistmembership.ContactListIDIn(IDs.ContactListIDs...)).
		Exec(ctx.Request().Context())
	if err != nil {
		return h.InternalServerError(ctx, err)
	}

	affected, err := tx.ContactList.Delete().
		Where(contactlist.IDIn(IDs.ContactListIDs...)).
		Exec(ctx.Request().Context())
	if err != nil {
		return h.InternalServerError(ctx, err)
	}

	h.Logger.Debugf("Deleted %d ContactLists, %s", affected, IDs)

	return h.Success(
		ctx,
		&models.ContactListsDeleteResponse{
			Reply:         rout.Reply{Success: true},
			CountAffected: affected,
		},
	)
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

	h.AddRequestBody("ContactListsDeleteRequest", models.ExampleContactListsDeleteRequest, contactListsDelete)

	h.AddResponse("ContactListsDeleteResponse", "success", models.ExampleContactListsDeleteSuccessResponse, contactListsDelete, http.StatusOK)
	contactListsDelete.AddResponse(http.StatusBadRequest, badRequest())
	contactListsDelete.AddResponse(http.StatusInternalServerError, internalServerError())
	contactListsDelete.AddResponse(http.StatusUnauthorized, unauthorized())

	return contactListsDelete
}

func (h *Handler) ContactListsMembersGet(ctx echo.Context) error {
	contactListMembersGetReq := models.ContactListMembersGetRequest{}
	if err := ctx.Bind(&contactListMembersGetReq); err != nil {
		return h.BadRequest(ctx, err)
	}

	contactListMembers, err := transaction.FromContext(ctx.Request().Context()).
		ContactListMembership.Query().
		Where(contactlistmembership.ContactListID(contactListMembersGetReq.ContactListID)).
		WithContact().
		All(ctx.Request().Context())
	if err != nil {
		return h.InternalServerError(ctx, err)
	}

	h.Logger.Debugf("ContactListMemberships, %s", contactListMembers)

	contactListMembersGetRes := models.ContactListMembersGetResponse{
		Reply:    rout.Reply{Success: true},
		Count:    len(contactListMembers),
		Contacts: models.ContactsFromGeneratedContactListMembers(contactListMembers),
	}

	return h.Success(ctx, contactListMembersGetRes)
}

func (h *Handler) BindContactListsMembersGet() *openapi3.Operation {
	contactListsMembersGet := openapi3.NewOperation()
	contactListsMembersGet.Description = "Get Contact List Members"
	contactListsMembersGet.OperationID = "ContactListsMembersGet"
	contactListsMembersGet.Security = &openapi3.SecurityRequirements{
		openapi3.SecurityRequirement{
			"bearerAuth": []string{},
		},
	}

	h.AddResponse("ContactListsMembersGetResponse", "success", models.ExampleContactListMembersGetSuccessResponse, contactListsMembersGet, http.StatusOK)
	contactListsMembersGet.AddResponse(http.StatusBadRequest, badRequest())
	contactListsMembersGet.AddResponse(http.StatusInternalServerError, internalServerError())
	contactListsMembersGet.AddResponse(http.StatusUnauthorized, unauthorized())

	return contactListsMembersGet
}

func (h *Handler) ContactListsMembersPost(ctx echo.Context) error {
	contactListsMembersPostReq := models.ContactListMembersPostRequest{}
	if err := ctx.Bind(&contactListsMembersPostReq); err != nil {
		return h.BadRequest(ctx, err)
	}

	contactList, err := transaction.FromContext(ctx.Request().Context()).
		ContactListMembership.
		MapCreateBulk(
			contactListsMembersPostReq.ContactIDs,
			func(builder *generated.ContactListMembershipCreate, i int) {
				builder.SetContactListID(contactListsMembersPostReq.ContactListID).
					SetContactID(contactListsMembersPostReq.ContactIDs[i])
			}).
		Save(ctx.Request().Context())
	if err != nil {
		return h.InternalServerError(ctx, err)
	}

	h.Logger.Debugf("Created %d ContactListMemberships, %s", len(contactList), contactListsMembersPostReq)

	return h.Success(ctx, models.ContactListMembersPostResponse{
		Reply:         rout.Reply{Success: true},
		CountAffected: len(contactList),
	})
}

func (h *Handler) BindContactListsMembersPost() *openapi3.Operation {
	contactListsMembersPost := openapi3.NewOperation()
	contactListsMembersPost.Description = "Add Contact List Members"
	contactListsMembersPost.OperationID = "ContactListsMembersPost"
	contactListsMembersPost.Security = &openapi3.SecurityRequirements{
		openapi3.SecurityRequirement{
			"bearerAuth": []string{},
		},
	}

	h.AddRequestBody("ContactListsMembersPostRequest", models.ExampleContactListMembersPostRequest, contactListsMembersPost)

	h.AddResponse("ContactListsMembersPostResponse", "success", models.ExampleContactListMembersPostSuccessResponse, contactListsMembersPost, http.StatusOK)
	contactListsMembersPost.AddResponse(http.StatusBadRequest, badRequest())
	contactListsMembersPost.AddResponse(http.StatusInternalServerError, internalServerError())
	contactListsMembersPost.AddResponse(http.StatusUnauthorized, unauthorized())

	return contactListsMembersPost
}

func (h *Handler) ContactListsMembersDelete(ctx echo.Context) error {
	contactListsMembersDeleteReq := models.ContactListMembersDeleteRequest{}
	if err := ctx.Bind(&contactListsMembersDeleteReq); err != nil {
		return h.BadRequest(ctx, err)
	}

	affected, err := transaction.FromContext(ctx.Request().Context()).
		ContactListMembership.Delete().
		Where(
			contactlistmembership.And(
				contactlistmembership.ContactListID(contactListsMembersDeleteReq.ContactListID),
				contactlistmembership.ContactIDIn(contactListsMembersDeleteReq.ContactIDs...),
			),
		).
		Exec(ctx.Request().Context())
	if err != nil {
		return h.InternalServerError(ctx, err)
	}

	h.Logger.Debugf("Deleted %d ContactListMemberships, %s", affected, contactListsMembersDeleteReq)

	return h.Success(ctx, models.ContactListMembersDeleteResponse{
		Reply:         rout.Reply{Success: true},
		CountAffected: affected,
	})
}

func (h *Handler) BindContactListsMembersDelete() *openapi3.Operation {
	contactListsMembersDelete := openapi3.NewOperation()
	contactListsMembersDelete.Description = "Remove Contact List Members"
	contactListsMembersDelete.OperationID = "ContactListsMembersDelete"
	contactListsMembersDelete.Security = &openapi3.SecurityRequirements{
		openapi3.SecurityRequirement{
			"bearerAuth": []string{},
		},
	}

	h.AddRequestBody("ContactListsMembersDeleteRequest", models.ExampleContactListMembersDeleteRequest, contactListsMembersDelete)

	h.AddResponse("ContactListsMembersDeleteResponse", "success", models.ExampleContactListMembersDeleteSuccessResponse, contactListsMembersDelete, http.StatusOK)
	contactListsMembersDelete.AddResponse(http.StatusBadRequest, badRequest())
	contactListsMembersDelete.AddResponse(http.StatusInternalServerError, internalServerError())
	contactListsMembersDelete.AddResponse(http.StatusUnauthorized, unauthorized())

	return contactListsMembersDelete
}

func (h *Handler) ContactListsMembersDeleteOne(ctx echo.Context) error {
	contactListsMembersDeleteOneReq := models.ContactListMembersDeleteOneRequest{}
	if err := ctx.Bind(&contactListsMembersDeleteOneReq); err != nil {
		return h.BadRequest(ctx, err)
	}

	affected, err := transaction.FromContext(ctx.Request().Context()).
		ContactListMembership.Delete().
		Where(
			contactlistmembership.And(
				contactlistmembership.ContactListID(contactListsMembersDeleteOneReq.ContactListID),
				contactlistmembership.ContactID(contactListsMembersDeleteOneReq.ContactID),
			),
		).
		Exec(ctx.Request().Context())
	if err != nil {
		return h.InternalServerError(ctx, err)
	}

	h.Logger.Debugf("Deleted %d ContactListMemberships, %s", affected, contactListsMembersDeleteOneReq)

	return h.Success(ctx, models.ContactListMembersDeleteOneResponse{
		Reply:         rout.Reply{Success: true},
		CountAffected: affected,
	})
}

func (h *Handler) BindContactListsMembersDeleteOne() *openapi3.Operation {
	contactListsMembersDeleteOne := openapi3.NewOperation()
	contactListsMembersDeleteOne.Description = "Remove One Contact List Member"
	contactListsMembersDeleteOne.OperationID = "ContactListsMembersDeleteOne"
	contactListsMembersDeleteOne.Security = &openapi3.SecurityRequirements{
		openapi3.SecurityRequirement{
			"bearerAuth": []string{},
		},
	}

	h.AddRequestBody("ContactListsMembersDeleteOneRequest", models.ExampleContactListMembersDeleteOneRequest, contactListsMembersDeleteOne)

	h.AddResponse("ContactListsMembersDeleteOneResponse", "success", models.ExampleContactListMembersDeleteOneSuccessResponse, contactListsMembersDeleteOne, http.StatusOK)
	contactListsMembersDeleteOne.AddResponse(http.StatusBadRequest, badRequest())
	contactListsMembersDeleteOne.AddResponse(http.StatusInternalServerError, internalServerError())
	contactListsMembersDeleteOne.AddResponse(http.StatusUnauthorized, unauthorized())

	return contactListsMembersDeleteOne
}
