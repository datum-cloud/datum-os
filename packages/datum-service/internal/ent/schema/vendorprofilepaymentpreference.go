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
)

type VendorProfilePaymentPreference struct {
	ent.Schema
}

func (VendorProfilePaymentPreference) Mixin() []ent.Mixin {
	return []ent.Mixin{
		emixin.IDMixin{},
		emixin.AuditMixin{},
		mixin.SoftDeleteMixin{},
		emixin.TagMixin{},
		OrgOwnerMixin{
			Ref: "vendor_profile_payment_preferences",
		},
	}
}

func (VendorProfilePaymentPreference) Fields() []ent.Field {
	return []ent.Field{
		field.String("vendor_profile_id").
			Comment("The ID of the vendor profile.").
			Optional(),
		field.Bool("preferred").
			Default(false).
			Comment("Whether this is the preferred payment method."),
		field.Enum("method").
			Comment("The payment method. (e.g. DOMESTIC_WIRE_TRANSFER, INTERNATIONAL_WIRE_TRANSFER, ACH, CREDIT_CARD)").
			GoType(enums.PaymentMethod("")).
			Default(string(enums.PaymentMethodUnspecified)),
	}
}

func (VendorProfilePaymentPreference) Indexes() []ent.Index {
	return []ent.Index{
		// Only one preferred payment method per vendor.
		index.Fields("vendor_profile_id", "preferred").Unique(),
	}
}

func (VendorProfilePaymentPreference) Hooks() []ent.Hook {
	return []ent.Hook{}
}

func (VendorProfilePaymentPreference) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("vendor_profile", VendorProfile.Type).
			Ref("payment_preferences").
			Unique().Field("vendor_profile_id"),
	}
}

func (VendorProfilePaymentPreference) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.QueryField(),
		entgql.RelayConnection(),
		entgql.Mutations(entgql.MutationCreate(), (entgql.MutationUpdate())),
	}
}

func (VendorProfilePaymentPreference) Policy() ent.Policy {
	return privacy.Policy{
		Query: privacy.QueryPolicy{
			privacy.AlwaysAllowRule(),
		},
		Mutation: privacy.MutationPolicy{
			privacy.AlwaysAllowRule(),
		},
	}
}
