package schema

import (
	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"github.com/datum-cloud/datum-os/internal/ent/generated/privacy"
	"github.com/datum-cloud/datum-os/internal/ent/mixin"
	emixin "github.com/datum-cloud/datum-os/pkg/entx/mixin"
	"github.com/datum-cloud/datum-os/pkg/enums"
	// "github.com/datum-cloud/datum-os/pkg/fgax/entfga"
)

type VendorProfilePostalAddress struct {
	ent.Schema
}

func (VendorProfilePostalAddress) Mixin() []ent.Mixin {
	return []ent.Mixin{
		emixin.AuditMixin{},
		emixin.IDMixin{},
		mixin.SoftDeleteMixin{},
	}
}

func (VendorProfilePostalAddress) Fields() []ent.Field {
	return []ent.Field{
		// This field must be named 'postal_address_type' to avoid issues with generated code using the reserved keyword 'type'.
		field.Enum("postal_address_type").
			GoType(enums.PostalAddressType("")).
			Default(string(enums.PostalAddressTypeMailing)),
		field.String("vendor_profile_id").NotEmpty().Immutable(),
		field.String("postal_address_id").NotEmpty().Immutable(),
	}
}

func (VendorProfilePostalAddress) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("postal_address", PostalAddress.Type).
			Field("postal_address_id").
			Required().
			Unique().
			Immutable(),
		edge.To("profile", VendorProfile.Type).
			Field("vendor_profile_id").
			Required().
			Unique().
			Immutable(),
		edge.To("events", Event.Type),
	}
}

func (VendorProfilePostalAddress) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("vendor_profile_id", "postal_address_id").Unique(),
	}
}

func (VendorProfilePostalAddress) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.QueryField(),
		entgql.RelayConnection(),
		entgql.Mutations(entgql.MutationCreate(), (entgql.MutationUpdate())),
		// entfga.Annotations{
		// 	ObjectType:   "vendor_profile",
		// 	IncludeHooks: true,
		// 	IDField:      "VendorProfileID",
		// },
	}
}

func (VendorProfilePostalAddress) Hooks() []ent.Hook {
	return []ent.Hook{}
}

func (VendorProfilePostalAddress) Policy() ent.Policy {
	return privacy.Policy{
		Mutation: privacy.MutationPolicy{
			privacy.AlwaysAllowRule(),
		},
		Query: privacy.QueryPolicy{
			privacy.AlwaysAllowRule(),
		},
	}
}
