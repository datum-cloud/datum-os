package services

import (
	"github.com/datum-cloud/datum-os/internal/httpserve/proto"
	"github.com/datum-cloud/datum-os/pkg/echox"
)

// (GET /v1alpha/organizations)
func (s Server) OrganizationsListOrganizations(ctx echox.Context, params proto.OrganizationsListOrganizationsParams) error {
	return nil
}

// (POST /v1alpha/organizations)
func (s Server) OrganizationsCreateOrganization(ctx echox.Context, params proto.OrganizationsCreateOrganizationParams) error {
	return nil
}

// (DELETE /v1alpha/organizations/{organization})
func (s Server) OrganizationsDeleteOrganization(ctx echox.Context, organization string, params proto.OrganizationsDeleteOrganizationParams) error {
	return nil
}

// (GET /v1alpha/organizations/{organization})
func (s Server) OrganizationsGetOrganization(ctx echox.Context, organization string) error {
	return nil
}

// (PATCH /v1alpha/organizations/{organization})
func (s Server) OrganizationsUpdateOrganization(ctx echox.Context, organization string, params proto.OrganizationsUpdateOrganizationParams) error {
	return nil
}
