package schema

import (
	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"github.com/datum-cloud/datum-os/internal/ent/generated/privacy"
	"github.com/datum-cloud/datum-os/internal/ent/mixin"
	"github.com/datum-cloud/datum-os/pkg/entx"
	emixin "github.com/datum-cloud/datum-os/pkg/entx/mixin"
	"github.com/datum-cloud/datum-os/pkg/enums"
)

type Vendor struct {
	ent.Schema
}

func (Vendor) Mixin() []ent.Mixin {
	return []ent.Mixin{
		emixin.AuditMixin{},
		mixin.SoftDeleteMixin{},
		emixin.IDMixin{},
		emixin.TagMixin{},
		OrgOwnerMixin{
			Ref: "vendors",
		},
	}
}

func (Vendor) Fields() []ent.Field {
	return []ent.Field{
		field.String("display_name").
			NotEmpty().
			MaxLen(nameMaxLen).
			Annotations(
				entgql.OrderField("display_name"),
			),
		// This field must be named 'vendor_type' to avoid issues with generated code using the reserved keyword 'type'.
		field.Enum("vendor_type").
			GoType(enums.VendorType("")).
			Default(string(enums.VendorTypeUnspecified)).
			Annotations(
				entgql.OrderField("vendor_type"),
			),
		field.Enum("onboarding_state").
			GoType(enums.OnboardingState("")).
			Default(string(enums.OnboardingStatePending)).
			Annotations(
				entgql.OrderField("onboarding_state"),
			),
	}
}

func (Vendor) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("profile", VendorProfile.Type).
			Required().
			Unique().
			Annotations(entx.CascadeAnnotationField("Vendor")),
		edge.To("events", Event.Type),
	}
}

func (Vendor) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("id").
			Unique(), // enforce globally unique ids
		index.Fields("display_name").
			Edges("owner").
			Unique().
			Annotations(entsql.IndexWhere("deleted_at is NULL")),
	}
}

func (Vendor) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.QueryField(),
		entgql.RelayConnection(),
		entgql.Mutations(entgql.MutationCreate(), (entgql.MutationUpdate())),
	}
}

func (Vendor) Policy() ent.Policy {
	return privacy.Policy{
		Mutation: privacy.MutationPolicy{
			privacy.AlwaysAllowRule(),
		},
		Query: privacy.QueryPolicy{
			privacy.AlwaysAllowRule(),
		},
	}
}
