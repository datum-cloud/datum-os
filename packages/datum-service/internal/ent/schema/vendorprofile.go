package schema

import (
	"errors"
	"net/url"

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
		field.String("dba_name").
			Comment("The Doing Business As (DBA) name of the Corporation").
			Optional().
			MaxLen(255),
		field.String("description").
			Comment("The description of the Corporation or Person and the services they provide").
			Optional().
			Annotations(
				entgql.Skip(entgql.SkipWhereInput),
			),
		field.String("website_uri").
			Comment("The URL of the website of the Corporation or Person").
			Optional().
			MaxLen(2048).Validate(func(s string) error {
			if _, err := url.Parse(s); err != nil {
				return errors.New("invalid URL")
			}
			return nil
		}),
	}
}

func (VendorProfile) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("postal_addresses", PostalAddress.Type).
			Through("vendor_profile_postal_addresses", VendorProfilePostalAddress.Type),
		edge.From("vendor", Vendor.Type).
			Ref("profile").Unique().Field("vendor_id").Immutable(),
	}
}

func (VendorProfile) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("id").Unique(),
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
			privacy.AlwaysDenyRule(),
		},
		Query: privacy.QueryPolicy{
			// TODO: Implement query policy for VendorProfile
			privacy.AlwaysDenyRule(),
		},
	}
}
