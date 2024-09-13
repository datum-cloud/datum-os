package schema

import (
	"context"

	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"github.com/datum-cloud/datum-os/internal/ent/generated"
	"github.com/datum-cloud/datum-os/internal/ent/generated/privacy"
	"github.com/datum-cloud/datum-os/internal/ent/mixin"
	emixin "github.com/datum-cloud/datum-os/pkg/entx/mixin"
	"github.com/datum-cloud/datum-os/pkg/fgax/entfga"
)

// ContactList holds the schema definition for the ContactList entity
type ContactListMembership struct {
	ent.Schema
}

func (ContactListMembership) Fields() []ent.Field {
	return []ent.Field{
		field.String("contact_list_id").Immutable(),
		field.String("contact_id").Immutable(),
	}
}

// Edges of the ContactListMembership
func (ContactListMembership) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("contact_list", ContactList.Type).
			Field("contact_list_id").
			Required().
			Unique().
			Immutable(),
		edge.To("contact", Contact.Type).
			Field("contact_id").
			Required().
			Unique().
			Immutable(),
		edge.To("events", Event.Type),
	}
}

// Annotations of the ContactListMembership
func (ContactListMembership) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.RelayConnection(),
		entgql.QueryField(),
		entgql.Mutations(entgql.MutationCreate(), (entgql.MutationUpdate())),
		entfga.Annotations{
			ObjectType:   "contact_list_membership",
			IncludeHooks: false,
		},
	}
}

// Indexes of the ContactListMembership
func (ContactListMembership) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("contact_id", "contact_list_id").
			Unique().
			Annotations(
				entsql.IndexWhere("deleted_at is NULL"),
			),
	}
}

// Mixin of the ContactListMembership
func (ContactListMembership) Mixin() []ent.Mixin {
	return []ent.Mixin{
		emixin.AuditMixin{},
		emixin.IDMixin{},
		mixin.SoftDeleteMixin{},
	}
}

// Hooks of the ContactListMembership
func (ContactListMembership) Hooks() []ent.Hook {
	return []ent.Hook{}
	// return []ent.Hook{
	// 	hooks.HookContactListMembers(),
	// }
}

// Policy of the ContactListMembership
func (ContactListMembership) Policy() ent.Policy {
	return privacy.Policy{
		Mutation: privacy.MutationPolicy{
			privacy.GroupMembershipMutationRuleFunc(func(ctx context.Context, m *generated.GroupMembershipMutation) error {
				return m.CheckAccessForEdit(ctx)
			}),
			privacy.AlwaysDenyRule(),
		},
		Query: privacy.QueryPolicy{
			privacy.GroupMembershipQueryRuleFunc(func(ctx context.Context, q *generated.GroupMembershipQuery) error {
				return q.CheckAccess(ctx)
			}),
			privacy.AlwaysDenyRule(),
		},
	}
}
