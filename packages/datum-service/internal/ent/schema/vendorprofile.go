package schema

import (
	"errors"
	"net/url"

	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"github.com/datum-cloud/datum-os/internal/ent/generated/privacy"
	"github.com/datum-cloud/datum-os/internal/ent/mixin"
	emixin "github.com/datum-cloud/datum-os/pkg/entx/mixin"
	"github.com/datum-cloud/datum-os/pkg/enums"
)

type VendorProfile struct {
	ent.Schema
}

func (VendorProfile) Mixin() []ent.Mixin {
	return []ent.Mixin{
		emixin.AuditMixin{},
		mixin.SoftDeleteMixin{},
		emixin.IDMixin{},
		emixin.TagMixin{},
		OrgOwnerMixin{
			Ref: "vendor_profiles",
		},
	}
}

func (VendorProfile) Fields() []ent.Field {
	return []ent.Field{
		field.String("vendor_id").
			Comment("The ID of the Vendor").
			NotEmpty().
			Immutable().
			Optional(),
		field.String("name").
			Comment("The name of the Corporation or Person").
			NotEmpty().
			MaxLen(255).
			Annotations(
				entgql.OrderField("name"),
			),
		field.String("corporation_type").
			Comment("The type of corporation (e.g. LLC, S-Corp, C-Corp, Other)").
			Optional().
			MaxLen(64),
		field.String("corporation_dba").
			Comment("The Doing Business As (DBA) name of the Corporation").
			Optional().
			MaxLen(64),
		field.String("description").
			Comment("The description of the Corporation or Person and the services they provide").
			Optional().
			Annotations(
				entgql.Skip(entgql.SkipWhereInput),
			),
		field.String("website_uri").
			Comment("The URL of the website of the Corporation or Person").
			Optional().
			MaxLen(2048).
			Validate(func(s string) error {
				if _, err := url.Parse(s); err != nil {
					return errors.New("invalid URL")
				}
				return nil
			}),
		field.String("tax_id").
			Comment("The tax ID of the Corporation or Person").
			Optional().
			Sensitive().
			MaxLen(32),
		field.Enum("tax_id_type").
			Comment("The type of tax ID (e.g. EIN, SSN, TIN, etc.)").
			GoType(enums.TaxIDType("")).
			Default(string(enums.TaxIDTypeUnspecified)),
	}
}

func (VendorProfile) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("postal_addresses", PostalAddress.Type).
			Through("vendor_profile_postal_addresses", VendorProfilePostalAddress.Type).
			Annotations(entsql.OnDelete(entsql.Cascade)),
		edge.To("phone_numbers", PhoneNumber.Type).
			Through("vendor_profile_phone_numbers", VendorProfilePhoneNumber.Type).
			Annotations(entsql.OnDelete(entsql.Cascade)),
		edge.To("payment_preferences", VendorProfilePaymentPreference.Type).
			Annotations(entsql.OnDelete(entsql.Cascade)),
		edge.From("vendor", Vendor.Type).
			Ref("profile").Unique().Field("vendor_id").Immutable(),
	}
}

func (VendorProfile) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("vendor_id").Unique(),
	}
}

func (VendorProfile) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.QueryField(),
		entgql.RelayConnection(),
		entgql.Mutations(entgql.MutationCreate(), (entgql.MutationUpdate())),
	}
}

func (VendorProfile) Hooks() []ent.Hook {
	return []ent.Hook{}
}

func (VendorProfile) Interceptors() []ent.Interceptor {
	return []ent.Interceptor{}
}

func (VendorProfile) Policy() ent.Policy {
	return privacy.Policy{
		Mutation: privacy.MutationPolicy{
			// TODO: Implement mutation policy for VendorProfile
			privacy.AlwaysAllowRule(),
		},
		Query: privacy.QueryPolicy{
			// TODO: Implement query policy for VendorProfile
			privacy.AlwaysAllowRule(),
		},
	}
}
