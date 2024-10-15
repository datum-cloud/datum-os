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

type VendorPaymentPreference struct {
	ent.Schema
}

func (VendorPaymentPreference) Mixin() []ent.Mixin {
	return []ent.Mixin{
		emixin.IDMixin{},
		emixin.AuditMixin{},
		mixin.SoftDeleteMixin{},
		emixin.TagMixin{},
		OrgOwnerMixin{
			Ref: "vendor_payment_preferences",
		},
	}
}

func (VendorPaymentPreference) Fields() []ent.Field {
	return []ent.Field{
		field.String("vendor_id").
			Comment("The ID of the vendor.").
			Optional(),
		field.Bool("preferred").
			Default(false).
			Comment("Whether this is the preferred payment method."),
		field.Enum("method").
			Comment("The payment method.").
			GoType(enums.PaymentMethod("")).
			Default(string(enums.PaymentMethodUnspecified)),
	}
}

func (VendorPaymentPreference) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("vendor_id", "preferred").Unique(),
	}
}

func (VendorPaymentPreference) Hooks() []ent.Hook {
	return []ent.Hook{}
}

func (VendorPaymentPreference) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("vendor", Vendor.Type).
			Ref("payment_preferences").
			Unique().Field("vendor_id"),
	}
}

func (VendorPaymentPreference) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.QueryField(),
		entgql.RelayConnection(),
		entgql.Mutations(entgql.MutationCreate(), (entgql.MutationUpdate())),
	}
}

func (VendorPaymentPreference) Policy() ent.Policy {
	return privacy.Policy{
		Query: privacy.QueryPolicy{
			privacy.AlwaysAllowRule(),
		},
		Mutation: privacy.MutationPolicy{
			privacy.AlwaysAllowRule(),
		},
	}
}
