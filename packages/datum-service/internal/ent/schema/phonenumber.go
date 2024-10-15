package schema

import (
	"errors"

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
	"github.com/nyaruka/phonenumbers"
)

type PhoneNumber struct {
	ent.Schema
}

func (PhoneNumber) Mixin() []ent.Mixin {
	return []ent.Mixin{
		emixin.AuditMixin{},
		mixin.SoftDeleteMixin{},
		emixin.IDMixin{},
		emixin.TagMixin{},
		OrgOwnerMixin{
			Ref: "phone_numbers",
		},
	}
}

func (PhoneNumber) Fields() []ent.Field {
	return []ent.Field{
		field.String("kind").
			Comment("The type of phone number. E.g. 'E164' or 'SHORT_CODE'").
			GoType(enums.PhoneNumberType("")).
			Default(string(enums.PhoneNumberTypeUnspecified)),
		field.String("region_code").
			Comment("The BCP-47 region code of the phone number. E.g. 'US' or 'CA'").
			MaxLen(3).
			Optional(),
		field.String("short_code").
			Comment("The short code of the phone number. E.g. '611'").
			Optional(),
		field.String("number").
			Comment("The phone number. E.g. '+15552220123'").
			Optional().
			Validate(func(s string) error {
				number, err := phonenumbers.Parse(s, "US")
				if err != nil {
					return errors.New("invalid phone number, failed to parse")
				}
				if !phonenumbers.IsValidNumber(number) {
					return errors.New("invalid phone number, not valid")
				}
				return nil
			}),
		field.String("extension").
			Comment("The extension of the phone number. E.g. '123'").
			Optional(),
	}
}

func (PhoneNumber) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("number").Unique(),
	}
}

func (PhoneNumber) Hooks() []ent.Hook {
	return []ent.Hook{}
}

func (PhoneNumber) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("profile", VendorProfile.Type).
			Ref("phone_numbers").
			Through("vendor_profile_phone_numbers", VendorProfilePhoneNumber.Type),
		edge.To("events", Event.Type),
	}
}

func (PhoneNumber) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.QueryField(),
		entgql.RelayConnection(),
		entgql.Mutations(entgql.MutationCreate(), (entgql.MutationUpdate())),
	}
}

func (PhoneNumber) Policy() ent.Policy {
	return privacy.Policy{
		Query: privacy.QueryPolicy{
			privacy.AlwaysAllowRule(),
		},
		Mutation: privacy.MutationPolicy{
			privacy.AlwaysAllowRule(),
		},
	}
}
