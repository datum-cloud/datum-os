package models

import (
	"fmt"

	"github.com/datum-cloud/datum-os/internal/ent/generated"
	"github.com/datum-cloud/datum-os/internal/httpserve/proto"
	"github.com/datum-cloud/datum-os/pkg/enums"
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

func VendorSpecStateFromEntity(state enums.OnboardingState) *proto.DatumOsVendormanagerV1alphaVendorSpecState {
	statePtr := func(s proto.DatumOsVendormanagerV1alphaVendorSpecState) *proto.DatumOsVendormanagerV1alphaVendorSpecState {
		return &s
	}
	switch state {
	case enums.OnboardingStateActive:
		return statePtr(proto.ONBOARDINGSTATEACTIVE)
	case enums.OnboardingStateInactive:
		return statePtr(proto.ONBOARDINGSTATEINACTIVE)
	case enums.OnboardingStatePending:
		return statePtr(proto.ONBOARDINGSTATEPENDING)
	default:
		return statePtr(proto.ONBOARDINGSTATEUNSPECIFIED)
	}
}

func VendorEnumStateFromSpecState(state proto.DatumOsVendormanagerV1alphaVendorSpecState) enums.OnboardingState {
	switch state {
	case proto.ONBOARDINGSTATEACTIVE:
		return enums.OnboardingStateActive
	case proto.ONBOARDINGSTATEINACTIVE:
		return enums.OnboardingStateInactive
	case proto.ONBOARDINGSTATEPENDING:
		return enums.OnboardingStatePending
	default:
		return enums.OnboardingStateUnspecified
	}
}

func VendorSpecTypeFromEntity(vendorType enums.VendorType) proto.DatumOsVendormanagerV1alphaVendorSpecType {
	switch vendorType {
	case enums.VendorTypeCorporation:
		return proto.VENDORTYPECORPORATION
	case enums.VendorTypePerson:
		return proto.VENDORTYPEPERSON
	default:
		return proto.VENDORTYPEUNSPECIFIED
	}
}

func VendorEnumTypeFromSpecType(vendorType proto.DatumOsVendormanagerV1alphaVendorSpecType) enums.VendorType {
	switch vendorType {
	case proto.VENDORTYPECORPORATION:
		return enums.VendorTypeCorporation
	case proto.VENDORTYPEPERSON:
		return enums.VendorTypePerson
	default:
		return enums.VendorTypeUnspecified
	}
}

func VendorResponseFromEntity(vendor *generated.Vendor, profile *generated.VendorProfile) *proto.DatumOsVendormanagerV1alphaVendor {
	return &proto.DatumOsVendormanagerV1alphaVendor{
		CreateTime:  &vendor.CreatedAt,
		DisplayName: &vendor.DisplayName,
		Etag:        nil,
		Name:        VendorNameFromEntity(vendor),
		Reconciling: &reconcilingFalse,
		Spec: proto.DatumOsVendormanagerV1alphaVendorSpec{
			Profile: proto.DatumOsVendormanagerV1alphaVendorProfile{
				CorporationDba:  &profile.CorporationDba,
				CorporationType: &profile.CorporationType,
				Description:     &profile.Description,
				WebsiteUri:      &profile.WebsiteURI,
			},
			State: VendorSpecStateFromEntity(vendor.OnboardingState),
			Type:  VendorSpecTypeFromEntity(vendor.VendorType),
		},
		Uid:        &vendor.ID,
		UpdateTime: &vendor.UpdatedAt,
		VendorId:   &vendor.ID,
	}
}

func WrapVendorResponse(vendor *proto.DatumOsVendormanagerV1alphaVendor) *proto.GoogleProtobufAny {
	any := &proto.GoogleProtobufAny{
		Type: MessageTypeURL("vendormanager", "v1alpha", "Vendor"),
	}
	any.Set("value", vendor)
	return any
}

func OperationCreateVendorResponseFromEntity(
	vendor *generated.Vendor, profile *generated.VendorProfile,
) *proto.GoogleLongrunningOperation {
	return &proto.GoogleLongrunningOperation{
		Done:     &doneTrue,
		Response: WrapVendorResponse(VendorResponseFromEntity(vendor, profile)),
	}
}
