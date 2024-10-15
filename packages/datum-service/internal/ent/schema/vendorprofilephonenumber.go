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
)

type VendorProfilePhoneNumber struct {
	ent.Schema
}

func (VendorProfilePhoneNumber) Mixin() []ent.Mixin {
	return []ent.Mixin{
		emixin.AuditMixin{},
		emixin.IDMixin{},
		mixin.SoftDeleteMixin{},
	}
}

func (VendorProfilePhoneNumber) Fields() []ent.Field {
	return []ent.Field{
		field.String("vendor_profile_id").NotEmpty().Immutable(),
		field.String("phone_number_id").NotEmpty().Immutable(),
	}
}

func (VendorProfilePhoneNumber) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("phone_number", PhoneNumber.Type).
			Field("phone_number_id").
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

func (VendorProfilePhoneNumber) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("vendor_profile_id", "phone_number_id").Unique(),
	}
}

func (VendorProfilePhoneNumber) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.QueryField(),
		entgql.RelayConnection(),
		entgql.Mutations(entgql.MutationCreate(), (entgql.MutationUpdate())),
	}
}

func (VendorProfilePhoneNumber) Hooks() []ent.Hook {
	return []ent.Hook{}
}

func (VendorProfilePhoneNumber) Policy() ent.Policy {
	return privacy.Policy{
		Query: privacy.QueryPolicy{
			privacy.AlwaysAllowRule(),
		},
		Mutation: privacy.MutationPolicy{
			privacy.AlwaysAllowRule(),
		},
	}
}
