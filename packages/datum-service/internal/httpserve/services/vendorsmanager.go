package services

import (
	"net/http"

	"github.com/datum-cloud/datum-os/internal/ent/generated"
	"github.com/datum-cloud/datum-os/internal/ent/generated/contactlist"
	"github.com/datum-cloud/datum-os/internal/ent/generated/contactlistmembership"
	echo "github.com/datum-cloud/datum-os/pkg/echox"
	"github.com/datum-cloud/datum-os/pkg/middleware/transaction"
)

// (GET /v1/vendors)
func (Server) VendorsListVendors(ctx echo.Context, params VendorsListVendorsParams) error {
	contacts, err := transaction.FromContext(ctx.Request().Context()).
		Contact.Query().
		WithContactListMembers(func(q *generated.ContactListMembershipQuery) {
			q.Where(contactlistmembership.DeletedAtIsNil())
			q.WithContactList(func(q *generated.ContactListQuery) {
				q.Where(contactlist.DeletedAtIsNil())
			})
		}).
		All(ctx.Request().Context())
	if err != nil {
		return err
	}

	ctx.JSON(http.StatusOK, contacts)

	return nil
}

// (POST /v1/vendors)
func (Server) VendorsCreateVendor(ctx echo.Context, params VendorsCreateVendorParams) error {
	return nil
}

// (DELETE /v1/vendors/{vendor})
func (Server) VendorsDeleteVendor(ctx echo.Context, vendor string) error {
	return nil
}

// (GET /v1/vendors/{vendor})
func (Server) VendorsGetVendor(ctx echo.Context, vendor string) error {
	return nil
}

// (PATCH /v1/vendors/{vendor})
func (Server) VendorsUpdateVendor(ctx echo.Context, vendor string, params VendorsUpdateVendorParams) error {
	return nil
}
