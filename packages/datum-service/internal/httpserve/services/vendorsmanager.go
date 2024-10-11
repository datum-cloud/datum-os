package services

import "github.com/datum-cloud/datum-os/pkg/echox"

// (GET /v1alpha/organizations/{organization}/vendors)
func (s Server) VendorsListVendors(ctx echox.Context, organization string, params VendorsListVendorsParams) error {
	return nil
}

// (POST /v1alpha/organizations/{organization}/vendors)
func (s Server) VendorsCreateVendor(ctx echox.Context, organization string, params VendorsCreateVendorParams) error {
	return nil
}

// (DELETE /v1alpha/organizations/{organization}/vendors/{vendor})
func (s Server) VendorsDeleteVendor(ctx echox.Context, organization string, vendor string, params VendorsDeleteVendorParams) error {
	return nil
}

// (GET /v1alpha/organizations/{organization}/vendors/{vendor})
func (s Server) VendorsGetVendor(ctx echox.Context, organization string, vendor string) error {
	return nil
}

// (PATCH /v1alpha/organizations/{organization}/vendors/{vendor})
func (s Server) VendorsUpdateVendor(ctx echox.Context, organization string, vendor string, params VendorsUpdateVendorParams) error {
	return nil
}

// (GET /v1alpha/vendors)
func (s Server) VendorsListVendors2(ctx echox.Context, params VendorsListVendors2Params) error {
	return nil
}

// (POST /v1alpha/vendors)
func (s Server) VendorsCreateVendor2(ctx echox.Context, params VendorsCreateVendor2Params) error {
	return nil
}

// (DELETE /v1alpha/vendors/{vendor})
func (s Server) VendorsDeleteVendor2(ctx echox.Context, vendor string, params VendorsDeleteVendor2Params) error {
	return nil
}

// (GET /v1alpha/vendors/{vendor})
func (s Server) VendorsGetVendor2(ctx echox.Context, vendor string) error {
	return nil
}

// (PATCH /v1alpha/vendors/{vendor})
func (s Server) VendorsUpdateVendor2(ctx echox.Context, vendor string, params VendorsUpdateVendor2Params) error {
	return nil
}
