package services

import "github.com/datum-cloud/datum-os/pkg/echox"

// (POST /v1alpha/invoices)
func (s Server) InvoicesCreateInvoice(ctx echox.Context, params InvoicesCreateInvoiceParams) error {
	return nil
}

// (DELETE /v1alpha/invoices/{invoice})
func (s Server) InvoicesDeleteInvoice(ctx echox.Context, invoice string, params InvoicesDeleteInvoiceParams) error {
	return nil
}

// (GET /v1alpha/invoices/{invoice})
func (s Server) InvoicesListInvoices(ctx echox.Context, invoice string, params InvoicesListInvoicesParams) error {
	return nil
}

// (PATCH /v1alpha/invoices/{invoice})
func (s Server) InvoicesUpdateInvoice(ctx echox.Context, invoice string, params InvoicesUpdateInvoiceParams) error {
	return nil
}

// (POST /v1alpha/organizations/{organization}/invoices)
func (s Server) InvoicesCreateInvoice2(ctx echox.Context, organization string, params InvoicesCreateInvoice2Params) error {
	return nil
}

// (DELETE /v1alpha/organizations/{organization}/invoices/{invoice})
func (s Server) InvoicesDeleteInvoice2(ctx echox.Context, organization string, invoice string, params InvoicesDeleteInvoice2Params) error {
	return nil
}

// (GET /v1alpha/organizations/{organization}/invoices/{invoice})
func (s Server) InvoicesListInvoices2(ctx echox.Context, organization string, invoice string, params InvoicesListInvoices2Params) error {
	return nil
}

// (PATCH /v1alpha/organizations/{organization}/invoices/{invoice})
func (s Server) InvoicesUpdateInvoice2(ctx echox.Context, organization string, invoice string, params InvoicesUpdateInvoice2Params) error {
	return nil
}

// (POST /v1alpha/vendors/{vendor}/invoices)
func (s Server) InvoicesCreateInvoice3(ctx echox.Context, vendor string, params InvoicesCreateInvoice3Params) error {
	return nil
}

// (DELETE /v1alpha/vendors/{vendor}/invoices/{invoice})
func (s Server) InvoicesDeleteInvoice3(ctx echox.Context, vendor string, invoice string, params InvoicesDeleteInvoice3Params) error {
	return nil
}

// (GET /v1alpha/vendors/{vendor}/invoices/{invoice})
func (s Server) InvoicesListInvoices3(ctx echox.Context, vendor string, invoice string, params InvoicesListInvoices3Params) error {
	return nil
}

// (PATCH /v1alpha/vendors/{vendor}/invoices/{invoice})
func (s Server) InvoicesUpdateInvoice3(ctx echox.Context, vendor string, invoice string, params InvoicesUpdateInvoice3Params) error {
	return nil
}
