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

	"github.com/datum-cloud/datum-os/pkg/entx"
	emixin "github.com/datum-cloud/datum-os/pkg/entx/mixin"
	"github.com/datum-cloud/datum-os/pkg/fgax/entfga"

	"github.com/datum-cloud/datum-os/internal/ent/generated"
	"github.com/datum-cloud/datum-os/internal/ent/generated/privacy"
	"github.com/datum-cloud/datum-os/internal/ent/mixin"
	"github.com/datum-cloud/datum-os/internal/ent/privacy/rule"
	"github.com/datum-cloud/datum-os/pkg/enums"
)

// ContactList holds the schema definition for the ContactList entity
type ContactList struct {
	ent.Schema
}

// Fields of the ContactList
func (ContactList) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").
			Comment("the name of the list").
			NotEmpty().
			Annotations(
				entgql.OrderField("name"),
			),
		field.String("visibility").
			Comment("the visibility of the list, for the subscriber").
			GoType(string(enums.Visibility(""))).
			Default(string(enums.VisibilityPrivate)),
		field.String("display_name").
			Comment("the friendly display name of the list").
			MaxLen(nameMaxLen).
			Default("").
			Annotations(
				entgql.OrderField("display_name"),
			),
		field.String("description").
			Comment("the description of the list").
			Optional().
			Annotations(
				entgql.Skip(entgql.SkipWhereInput),
			),
	}
}

// Mixin of the ContactList
func (ContactList) Mixin() []ent.Mixin {
	return []ent.Mixin{
		emixin.AuditMixin{},
		mixin.SoftDeleteMixin{},
		emixin.IDMixin{},
		emixin.TagMixin{},
		OrgOwnerMixin{
			Ref: "contact_lists",
		},
	}
}

// Edges of the ContactList
func (ContactList) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("contacts", Contact.Type).
			Ref("contact_lists").
			Through("contact_list_members", ContactListMembership.Type),
		edge.To("events", Event.Type),
		edge.To("integrations", Integration.Type),
	}
}

// Indexes of the ContactList
func (ContactList) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("name").
			Edges("owner").
			Unique().
			Annotations(entsql.IndexWhere("deleted_at is NULL")),
	}
}

// Annotations of the ContactList
func (ContactList) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.RelayConnection(),
		entgql.QueryField(),
		entgql.Mutations(entgql.MutationCreate(), (entgql.MutationUpdate())),
		// Delete contact list members when contact lists are deleted
		entx.CascadeThroughAnnotationField(
			[]entx.ThroughCleanup{
				{
					Field:   "ContactList",
					Through: "ContactListMembership",
				},
			},
		),
		entfga.Annotations{
			ObjectType:      "organization",
			IncludeHooks:    false,
			NillableIDField: true,
			OrgOwnedField:   true,
			IDField:         "OwnerID",
		},
	}
}

// Policy of the ContactList
func (ContactList) Policy() ent.Policy {
	return privacy.Policy{
		Mutation: privacy.MutationPolicy{
			privacy.ContactListMutationRuleFunc(func(ctx context.Context, m *generated.ContactListMutation) error {
				return m.CheckAccessForEdit(ctx)
			}),
			rule.AllowIfOrgEditor(),
			privacy.AlwaysDenyRule(),
		},
		Query: privacy.QueryPolicy{
			privacy.ContactListQueryRuleFunc(func(ctx context.Context, q *generated.ContactListQuery) error {
				return q.CheckAccess(ctx)
			}),
			rule.AllowIfOrgViewer(),
			privacy.AlwaysDenyRule(),
		},
	}
}

// Hooks of the ContactList
func (ContactList) Hooks() []ent.Hook {
	return []ent.Hook{}
	// return []ent.Hook{
	// 	hooks.HookContactListAuthz(),
	// 	hooks.HookContactList(),
	// }
}

// Interceptors of the ContactList
func (ContactList) Interceptors() []ent.Interceptor {
	return []ent.Interceptor{}
	// return []ent.Interceptor{
	// 	interceptors.InterceptorContactList(),
	// }
}
