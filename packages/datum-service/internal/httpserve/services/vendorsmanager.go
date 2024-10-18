package services

import (
	"context"
	"fmt"
	"net/http"

	"github.com/datum-cloud/datum-os/internal/ent/generated"
	"github.com/datum-cloud/datum-os/internal/httpserve/proto"
	"github.com/datum-cloud/datum-os/pkg/echox"
	"github.com/datum-cloud/datum-os/pkg/entx"
	"github.com/datum-cloud/datum-os/pkg/enums"
	"github.com/datum-cloud/datum-os/pkg/middleware/transaction"
	"github.com/datum-cloud/datum-os/pkg/models"
)

// (GET /v1alpha/organizations/{organization}/vendors)
func (s Server) VendorsListVendors(ctx echox.Context, organization string, params proto.VendorsListVendorsParams) error {
	return nil
}

// (POST /v1alpha/organizations/{organization}/vendors)
func (s Server) VendorsCreateVendor(ctx echox.Context, organization string, params proto.VendorsCreateVendorParams) error {
	return nil
}

// (DELETE /v1alpha/organizations/{organization}/vendors/{vendor})
func (s Server) VendorsDeleteVendor(ctx echox.Context, organization string, vendor string, params proto.VendorsDeleteVendorParams) error {
	return nil
}

// (GET /v1alpha/organizations/{organization}/vendors/{vendor})
func (s Server) VendorsGetVendor(ctx echox.Context, organization string, vendor string) error {
	return nil
}

// (PATCH /v1alpha/organizations/{organization}/vendors/{vendor})
func (s Server) VendorsUpdateVendor(ctx echox.Context, organization string, vendor string, params proto.VendorsUpdateVendorParams) error {
	return nil
}

// (GET /v1alpha/vendors)
func (s Server) VendorsListVendors2(ctx echox.Context, params proto.VendorsListVendors2Params) error {
	return nil
}

// (POST /v1alpha/vendors)
func (s Server) VendorsCreateVendor2(ctx echox.Context, params proto.VendorsCreateVendor2Params) error {
	var reqVendor proto.VendorsCreateVendor2JSONRequestBody
	if err := ctx.Bind(&reqVendor); err != nil {
		return echox.NewHTTPError(
			http.StatusBadRequest,
			fmt.Sprintf("could not bind request body: %s", err.Error()),
		)
	}

	vendorType := models.VendorEnumTypeFromSpecType(reqVendor.Spec.Type)

	var vendorName *string
	switch vendorType {
	case enums.VendorTypePerson:
		vendorName = reqVendor.Spec.Profile.Person
		if vendorName == nil {
			return echox.NewHTTPError(
				http.StatusBadRequest,
				"vendor profile person is required for person vendors",
			)
		}
	case enums.VendorTypeCorporation:
		vendorName = reqVendor.Spec.Profile.Corporation
		if vendorName == nil {
			return echox.NewHTTPError(
				http.StatusBadRequest,
				"vendor profile corporation is required for corporation vendors",
			)
		}
	default:
		return echox.NewHTTPError(
			http.StatusBadRequest,
			"invalid vendor type",
		)
	}

	displayName := reqVendor.DisplayName
	if displayName == nil {
		displayName = vendorName
	}

	// If the client has set the validate only flag, we will not create any resources, but will return a 200 OK along with
	// what a successful creation would look like, except the server generated fields will be empty.
	validateOnly := params.ValidateOnly != nil && *params.ValidateOnly
	if validateOnly {
		// We would normally set the DisplayName automatically if it was not set, but since we are not creating any
		// resources, we will set it manually.
		reqVendor.DisplayName = displayName

		return ctx.JSON(http.StatusOK, models.WrapVendorResponse(&reqVendor))
	}

	// TODO: Create and Add Postal Addresses
	// TODO: Create and Add Contact Details
	// TODO: Create and Add Tax ID
	// TODO: Create and Add Named Owner
	// TODO: Create and Add Phone Numbers

	tx := transaction.FromContext(ctx.Request().Context())
	profile, err := tx.VendorProfile.Create().
		SetName(*vendorName).
		SetNillableCorporationDba(reqVendor.Spec.Profile.CorporationDba).
		SetNillableCorporationType(reqVendor.Spec.Profile.CorporationType).
		SetNillableDescription(reqVendor.Spec.Profile.Description).
		SetNillableWebsiteURI(reqVendor.Spec.Profile.WebsiteUri).
		Save(ctx.Request().Context())
	if err != nil {
		return echox.NewHTTPError(
			http.StatusInternalServerError,
			fmt.Sprintf("could not create vendor profile %s", err.Error()),
		)
	}

	vendor, err := tx.Vendor.Create().
		SetVendorType(vendorType).
		SetDisplayName(*displayName).
		SetProfile(profile).
		Save(ctx.Request().Context())
	if err != nil {
		return echox.NewHTTPError(
			http.StatusInternalServerError,
			fmt.Sprintf("could not create vendor %s", err.Error()),
		)
	}

	return ctx.JSON(
		http.StatusCreated,
		models.OperationCreateVendorResponseFromEntity(vendor, profile),
	)
}

// (DELETE /v1alpha/vendors/{vendor})
func (s Server) VendorsDeleteVendor2(ctx echox.Context, vendorID string, params proto.VendorsDeleteVendor2Params) error {
	tx := transaction.FromContext(ctx.Request().Context())
	vendor, err := tx.Vendor.Get(ctx.Request().Context(), vendorID)
	if err != nil {
		// Not Found gets special handling because of allow_missing.
		if generated.IsNotFound(err) {
			// If allow_missing is set, we will return a 200 OK with an empty object
			if params.AllowMissing != nil && *params.AllowMissing {
				return ctx.JSON(
					http.StatusOK,
					struct{}{},
				)
			}
			// Otherwise, we will return a 404 Not Found
			return echox.NewHTTPError(
				http.StatusNotFound,
				fmt.Sprintf("could not find vendor %s", err.Error()),
			)
		}
		// Everything else is an internal server error.
		return echox.NewHTTPError(
			http.StatusInternalServerError, err.Error(),
		)
	}

	etag := models.MakeEtag(&vendor.UpdatedAt)
	if params.Etag != nil && *params.Etag != *etag {
		return echox.NewHTTPError(
			http.StatusConflict,
			"vendor has been updated since last fetched",
		)
	}

	// If validate_only is set to true, we're done here. We don't need to actually delete anything.
	if params.ValidateOnly != nil && *params.ValidateOnly {
		return ctx.JSON(http.StatusOK, struct{}{})
	}

	profile, err := vendor.Profile(ctx.Request().Context())
	if err != nil {
		return echox.NewHTTPError(
			http.StatusInternalServerError,
			fmt.Sprintf("could not retrieve vendor profile %s", err.Error()),
		)
	}

	// Delete the profile first because it has a foreign key constraint on the vendor.
	err = tx.VendorProfile.DeleteOne(profile).Exec(ctx.Request().Context())
	if err != nil {
		return echox.NewHTTPError(
			http.StatusInternalServerError,
			fmt.Sprintf("could not delete vendor profile %s", err.Error()),
		)
	}

	err = tx.Vendor.DeleteOne(vendor).Exec(ctx.Request().Context())
	if err != nil {
		return echox.NewHTTPError(
			http.StatusInternalServerError,
			fmt.Sprintf("could not delete vendor %s", err.Error()),
		)
	}

	// Refetch the vendor and profile to get the updated values.
	ctxWithDeleted := context.WithValue(ctx.Request().Context(), entx.SoftDeleteSkipKey{}, true)
	vendor, err = tx.Vendor.Get(ctxWithDeleted, vendorID)
	if err != nil {
		return echox.NewHTTPError(
			http.StatusInternalServerError,
			fmt.Sprintf("could not retrieve vendor %s", err.Error()),
		)
	}
	profile, err = vendor.Profile(ctxWithDeleted)
	if err != nil {
		return echox.NewHTTPError(
			http.StatusInternalServerError,
			fmt.Sprintf("could not retrieve vendor profile %s", err.Error()),
		)
	}

	return ctx.JSON(
		http.StatusOK,
		models.OperationDeleteVendorResponseFromEntity(vendor, profile),
	)
}

// (GET /v1alpha/vendors/{vendor})
func (s Server) VendorsGetVendor2(ctx echox.Context, vendorID string) error {
	ctxWithDeleted := context.WithValue(ctx.Request().Context(), entx.SoftDeleteSkipKey{}, true)
	tx := transaction.FromContext(ctxWithDeleted)
	vendor, err := tx.Vendor.Get(ctxWithDeleted, vendorID)
	if err != nil {
		return echox.NewHTTPError(
			http.StatusNotFound,
			fmt.Sprintf("could not find vendor %s", err.Error()),
		)
	}
	profile, err := vendor.Profile(ctxWithDeleted)
	if err != nil {
		return echox.NewHTTPError(
			http.StatusInternalServerError,
			fmt.Sprintf("could not find vendor profile %s", err.Error()),
		)
	}
	return ctx.JSON(http.StatusOK, models.VendorResponseFromEntity(vendor, profile))
}

// (PATCH /v1alpha/vendors/{vendor})
func (s Server) VendorsUpdateVendor2(ctx echox.Context, vendor string, params proto.VendorsUpdateVendor2Params) error {
	return nil
}
