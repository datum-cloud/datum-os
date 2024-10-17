package services

import (
	"fmt"
	"net/http"

	"github.com/datum-cloud/datum-os/internal/httpserve/proto"
	"github.com/datum-cloud/datum-os/pkg/echox"
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

	vendorType := enums.ToVendorTypeFromInt(reqVendor.Spec.Type)
	if vendorType == nil {
		return echox.NewHTTPError(
			http.StatusBadRequest,
			fmt.Sprintf("invalid vendor type: %d", reqVendor.Spec.Type),
		)
	}

	var vendorName *string
	switch *vendorType {
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
		SetVendorType(*vendorType).
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
func (s Server) VendorsDeleteVendor2(ctx echox.Context, vendor string, params proto.VendorsDeleteVendor2Params) error {
	return nil
}

// (GET /v1alpha/vendors/{vendor})
func (s Server) VendorsGetVendor2(ctx echox.Context, vendor string) error {
	tx := transaction.FromContext(ctx.Request().Context())
	ret, err := tx.Vendor.Get(ctx.Request().Context(), vendor)
	if err != nil {
		return echox.NewHTTPError(
			http.StatusNotFound,
			fmt.Sprintf("could not find vendor %s", err.Error()),
		)
	}
	return ctx.JSON(http.StatusOK, ret)
}

// (PATCH /v1alpha/vendors/{vendor})
func (s Server) VendorsUpdateVendor2(ctx echox.Context, vendor string, params proto.VendorsUpdateVendor2Params) error {
	return nil
}
