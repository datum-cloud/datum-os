package models

import (
	"fmt"

	"github.com/datum-cloud/datum-os/internal/ent/generated"
	"github.com/datum-cloud/datum-os/internal/httpserve/proto"
)

var (
	doneTrue         = true
	reconcilingFalse = false
)

func MessageTypeURL(service string, version string, message string) *string {
	typeURL := fmt.Sprintf("type.datumapis.com/os/%s/%s/%s", service, version, message)
	return &typeURL
}

func OrganizationVendorNameFromEntity(vendor *generated.Vendor) *string {
	name := fmt.Sprintf("organizations/%s/vendors/%s", vendor.OwnerID, vendor.ID)
	return &name
}

func VendorNameFromEntity(vendor *generated.Vendor) *string {
	name := fmt.Sprintf("vendors/%s", vendor.ID)
	return &name
}

func VendorResponseFromEntity(vendor *generated.Vendor, profile *generated.VendorProfile) *proto.Vendor {
	return &proto.Vendor{
		CreateTime:  &vendor.CreatedAt,
		DisplayName: &vendor.DisplayName,
		Etag:        nil,
		Name:        VendorNameFromEntity(vendor),
		Reconciling: &reconcilingFalse,
		Spec: proto.VendorSpec{
			Profile: proto.VendorProfile{
				CorporationDba:  &profile.CorporationDba,
				CorporationType: &profile.CorporationType,
				Description:     &profile.Description,
				WebsiteUri:      &profile.WebsiteURI,
			},
			State: vendor.OnboardingState.IntPtr(),
			Type:  vendor.VendorType.Int(),
		},
		Uid:        &vendor.ID,
		UpdateTime: &vendor.UpdatedAt,
		VendorId:   &vendor.ID,
	}
}

func WrapVendorResponse(vendor *proto.Vendor) *proto.GoogleProtobufAny {
	any := &proto.GoogleProtobufAny{
		Type: MessageTypeURL("vendormanager", "v1alpha", "Vendor"),
	}
	any.Set("value", vendor)
	return any
}

func OperationCreateVendorResponseFromEntity(
	vendor *generated.Vendor, profile *generated.VendorProfile,
) *proto.Operation {
	return &proto.Operation{
		Done:     &doneTrue,
		Response: WrapVendorResponse(VendorResponseFromEntity(vendor, profile)),
	}
}
