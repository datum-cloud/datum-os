package schema

import (
	"context"
	"net/mail"

	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"

	emixin "github.com/datum-cloud/datum-os/pkg/entx/mixin"
	"github.com/datum-cloud/datum-os/pkg/fgax/entfga"

	"github.com/datum-cloud/datum-os/internal/ent/generated"
	"github.com/datum-cloud/datum-os/internal/ent/generated/privacy"
	"github.com/datum-cloud/datum-os/internal/ent/hooks"
	"github.com/datum-cloud/datum-os/internal/ent/mixin"
	"github.com/datum-cloud/datum-os/internal/ent/privacy/rule"
	"github.com/datum-cloud/datum-os/internal/ent/validator"
	"github.com/datum-cloud/datum-os/pkg/enums"
	"github.com/datum-cloud/datum-os/pkg/rout"
)

// Contact holds the schema definition for the Contact entity
type Contact struct {
	ent.Schema
}

// Fields of the Contact
func (Contact) Fields() []ent.Field {
	return []ent.Field{
		field.String("full_name").
			Comment("the full name of the contact").
			MaxLen(nameMaxLen).
			NotEmpty(),
		field.String("title").
			Comment("the title of the contact").
			Optional(),
		field.String("company").
			Comment("the company of the contact").
			Optional(),
		field.String("email").
			Comment("the email of the contact").
			Optional().
			Validate(func(email string) error {
				_, err := mail.ParseAddress(email)
				return err
			}),
		field.String("phone_number").
			Comment("the phone number of the contact").
			Validate(func(s string) error {
				valid := validator.ValidatePhoneNumber(s)
				if !valid {
					return rout.InvalidField("phone_number")
				}

				return nil
			}).
			Optional(),
		field.String("address").
			Comment("the address of the contact").
			Optional(),
		field.Enum("status").
			Comment("status of the contact").
			GoType(enums.UserStatus("")).
			Default(string(enums.UserStatusActive)),
	}
}

// Mixin of the Contact
func (Contact) Mixin() []ent.Mixin {
	return []ent.Mixin{
		emixin.AuditMixin{},
		emixin.IDMixin{},
		mixin.SoftDeleteMixin{},
		emixin.TagMixin{},
		OrgOwnerMixin{
			Ref: "contacts",
		},
	}
}

// Edges of the Contact
func (Contact) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("contact_lists", ContactList.Type).
			Through("contact_list_memberships", ContactListMembership.Type),
		edge.From("entities", Entity.Type).
			Ref("contacts"),
	}
}

// Indexes of the Contact
func (Contact) Indexes() []ent.Index {
	return []ent.Index{}
}

// Annotations of the Contact
func (Contact) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.QueryField(),
		entgql.RelayConnection(),
		entgql.Mutations(entgql.MutationCreate(), (entgql.MutationUpdate())),
		entfga.Annotations{
			ObjectType:      "organization",
			IncludeHooks:    false,
			NillableIDField: true,
			OrgOwnedField:   true,
			IDField:         "OwnerID",
		},
	}
}

// Hooks of the Contact
func (Contact) Hooks() []ent.Hook {
	return []ent.Hook{
		hooks.HookDeleteContact(),
	}
}

// Interceptors of the Contact
func (Contact) Interceptors() []ent.Interceptor {
	return []ent.Interceptor{}
}

// Policy of the Contact
func (Contact) Policy() ent.Policy {
	return privacy.Policy{
		Mutation: privacy.MutationPolicy{
			privacy.ContactMutationRuleFunc(func(ctx context.Context, m *generated.ContactMutation) error {
				return m.CheckAccessForEdit(ctx)
			}),
			rule.AllowIfOrgEditor(),
			privacy.AlwaysDenyRule(),
		},
		Query: privacy.QueryPolicy{
			privacy.ContactQueryRuleFunc(func(ctx context.Context, q *generated.ContactQuery) error {
				return q.CheckAccess(ctx)
			}),
			rule.AllowIfOrgViewer(),
			privacy.AlwaysDenyRule(),
		},
	}
}
