package schema

import (
	"context"

	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"

	emixin "github.com/datum-cloud/datum-os/pkg/entx/mixin"
	"github.com/datum-cloud/datum-os/pkg/fgax/entfga"

	"github.com/datum-cloud/datum-os/internal/ent/generated"
	"github.com/datum-cloud/datum-os/internal/ent/generated/privacy"
	"github.com/datum-cloud/datum-os/internal/ent/mixin"
	"github.com/datum-cloud/datum-os/pkg/enums"
)

// GroupSetting holds the schema definition for the GroupSetting entity
type GroupSetting struct {
	ent.Schema
}

// Fields of the GroupSetting.
func (GroupSetting) Fields() []ent.Field {
	return []ent.Field{
		field.Enum("visibility").
			Comment("whether the group is visible to it's members / owners only or if it's searchable by anyone within the organization").
			GoType(enums.Visibility("")).
			Default(string(enums.VisibilityPublic)),
		field.Enum("join_policy").
			Comment("the policy governing ability to freely join a group, whether it requires an invitation, application, or either").
			GoType(enums.JoinPolicy("")).
			Default(string(enums.JoinPolicyInviteOrApplication)),
		field.Bool("sync_to_slack").
			Comment("whether to sync group members to slack groups").
			Optional().
			Default(false),
		field.Bool("sync_to_github").
			Comment("whether to sync group members to github groups").
			Optional().
			Default(false),
		field.String("group_id").
			Comment("the group id associated with the settings").
			Optional(),
	}
}

// Edges of the GroupSetting
func (GroupSetting) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("group", Group.Type).Ref("setting").Field("group_id").Unique(),
	}
}

// Annotations of the GroupSetting
func (GroupSetting) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.QueryField(),
		entgql.RelayConnection(),
		entgql.Mutations(entgql.MutationCreate(), (entgql.MutationUpdate())),
		entfga.Annotations{
			ObjectType:      "group",
			IncludeHooks:    false,
			IDField:         "GroupID",
			NillableIDField: true,
		},
	}
}

// Mixin of the GroupSetting
func (GroupSetting) Mixin() []ent.Mixin {
	return []ent.Mixin{
		emixin.AuditMixin{},
		emixin.IDMixin{},
		emixin.TagMixin{},
		mixin.SoftDeleteMixin{},
	}
}

// Policy defines the privacy policy of the GroupSetting
func (GroupSetting) Policy() ent.Policy {
	return privacy.Policy{
		Mutation: privacy.MutationPolicy{
			privacy.GroupSettingMutationRuleFunc(func(ctx context.Context, m *generated.GroupSettingMutation) error {
				return m.CheckAccessForEdit(ctx)
			}),
			privacy.AlwaysDenyRule(),
		},
		Query: privacy.QueryPolicy{
			privacy.GroupSettingQueryRuleFunc(func(ctx context.Context, q *generated.GroupSettingQuery) error {
				return q.CheckAccess(ctx)
			}),
			privacy.AlwaysDenyRule(),
		},
	}
}
