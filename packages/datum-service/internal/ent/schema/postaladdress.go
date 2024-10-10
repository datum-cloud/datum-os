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
	emixin "github.com/datum-cloud/datum-os/pkg/entx/mixin"
)

type PostalAddress struct {
	ent.Schema
}

func (PostalAddress) Mixin() []ent.Mixin {
	return []ent.Mixin{
		emixin.AuditMixin{},
		mixin.SoftDeleteMixin{},
		emixin.IDMixin{},
		emixin.TagMixin{},
		OrgOwnerMixin{
			Ref: "postal_addresses",
		},
	}
}

func (PostalAddress) Fields() []ent.Field {
	return []ent.Field{
		field.String("region_code").
			Comment("CLDR region code of the country/region of the address. See https://cldr.unicode.org/ for more details.").
			NotEmpty().
			MaxLen(2).
			Annotations(
				entgql.OrderField("region_code"),
			),
		field.String("language_code").
			Comment("BCP-47 language code of the contents of this address (if known).").
			Optional().
			Nillable().
			MaxLen(10),
		field.String("postal_code").
			Comment("Postal code of the address. Not all countries use or require postal codes to be present, but where they are used, they may trigger additional validation with other parts of the address (e.g. state/zip validation in the U.S.A.).").
			Optional().
			Nillable().
			MaxLen(12),
		field.String("sorting_code").
			Comment("Additional, country-specific, sorting code. This is not used in most regions.").
			Optional().
			Nillable().
			MaxLen(10),
		field.String("administrative_area").
			Comment("Highest administrative subdivision which is used for postal addresses of a country or region. For example, this can be a state, a province, an oblast, or a prefecture.").
			Optional().
			Nillable().
			MaxLen(100),
		field.String("locality").
			Comment("Locality of the address. Generally refers to the city/town portion of the address. Examples: US city, IT comune, UK post town.").
			Optional().
			Nillable().
			MaxLen(100),
		field.String("sublocality").
			Comment("Sublocality of the address. This is the neighborhood, district, or town.").
			Optional().
			Nillable().
			MaxLen(100),
		field.Strings("address_lines").
			Comment("Unstructured address lines describing the lower levels of an address."),
		field.Strings("recipients").
			Comment(
				"Recipients of the address. This field may, under certain circumstances, contain multiline information. " +
					"For example, it might contain 'care of' information."),
		field.String("organization").
			Comment("Organization of the address.").
			Optional().
			Nillable().
			MaxLen(100),
	}
}

func (PostalAddress) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("events", Event.Type),
		edge.From("profile", VendorProfile.Type).
			Ref("postal_addresses").
			Through("vendor_profile_postal_addresses", VendorProfilePostalAddress.Type),
	}
}

func (PostalAddress) Indexes() []ent.Index {
	return []ent.Index{
		// We have an organization with many postal addresses, and we want to set the postal addresses to be unique under each organization
		index.Fields("region_code", "locality", "sublocality", "administrative_area", "postal_code", "address_lines").
			Edges("owner").
			Unique().
			Annotations(entsql.IndexWhere("deleted_at is NULL")),
	}
}

func (PostalAddress) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.QueryField(),
		entgql.RelayConnection(),
		entgql.Mutations(entgql.MutationCreate(), (entgql.MutationUpdate())),
	}
}

func (PostalAddress) Policy() ent.Policy {
	return privacy.Policy{
		// TODO: Implement mutation policy for PostalAddress
		Mutation: privacy.MutationPolicy{
			privacy.AlwaysAllowRule(),
		},
		// TODO: Implement query policy for PostalAddress
		Query: privacy.QueryPolicy{
			privacy.AlwaysAllowRule(),
		},
	}
}
