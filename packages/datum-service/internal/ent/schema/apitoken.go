package schema

import (
	"context"

	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"

	emixin "github.com/datum-cloud/datum-os/pkg/entx/mixin"
	"github.com/datum-cloud/datum-os/pkg/fgax/entfga"
	"github.com/flume/enthistory"

	"github.com/datum-cloud/datum-os/internal/ent/generated"
	"github.com/datum-cloud/datum-os/internal/ent/generated/privacy"
	"github.com/datum-cloud/datum-os/internal/ent/hooks"
	"github.com/datum-cloud/datum-os/internal/ent/interceptors"
	"github.com/datum-cloud/datum-os/internal/ent/mixin"
	"github.com/datum-cloud/datum-os/pkg/keygen"
)

// APIToken holds the schema definition for the APIToken entity.
type APIToken struct {
	ent.Schema
}

// Fields of the APIToken
func (APIToken) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").
			Comment("the name associated with the token").
			NotEmpty(),
		field.String("token").
			Unique().
			Immutable().
			Annotations(
				entgql.Skip(^entgql.SkipType),
			).
			DefaultFunc(func() string {
				token := keygen.PrefixedSecret("dtma") // datum api token prefix
				return token
			}),
		field.Time("expires_at").
			Comment("when the token expires").
			Annotations(
				entgql.Skip(entgql.SkipMutationUpdateInput),
			).
			Optional().
			Nillable(),
		field.String("description").
			Comment("a description of the token's purpose").
			Optional().
			Nillable().
			Annotations(
				entgql.Skip(entgql.SkipWhereInput),
			),
		field.JSON("scopes", []string{}).
			Optional(),
		field.Time("last_used_at").
			Optional().
			Nillable(),
	}
}

// Edges of the APIToken
func (APIToken) Edges() []ent.Edge {
	return []ent.Edge{}
}

// Indexes of the APIToken
func (APIToken) Indexes() []ent.Index {
	return []ent.Index{
		// non-unique index.
		index.Fields("token"),
	}
}

// Mixin of the APIToken
func (APIToken) Mixin() []ent.Mixin {
	return []ent.Mixin{
		emixin.AuditMixin{},
		mixin.SoftDeleteMixin{},
		emixin.IDMixin{},
		emixin.TagMixin{},
		OrgOwnerMixin{
			Ref: "api_tokens",
			// skip the interceptor for Only queries when the token is being checked
			// and we do not yet know the organization
			SkipInterceptor: interceptors.SkipOnlyQuery,
		},
	}
}

// Annotations of the APIToken
func (APIToken) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.QueryField(),
		entgql.RelayConnection(),
		entgql.Mutations(entgql.MutationCreate(), (entgql.MutationUpdate())),
		enthistory.Annotations{
			Exclude: true,
		},
		entfga.Annotations{
			ObjectType:      "organization",
			IncludeHooks:    false,
			NillableIDField: true,
			OrgOwnedField:   true,
			IDField:         "OwnerID",
		},
	}
}

// Hooks of the APIToken
func (APIToken) Hooks() []ent.Hook {
	return []ent.Hook{
		hooks.HookCreateAPIToken(),
		hooks.HookUpdateAPIToken(),
	}
}

// Interceptors of the APIToken
func (APIToken) Interceptors() []ent.Interceptor {
	return []ent.Interceptor{
		interceptors.InterceptorAPIToken(),
	}
}

// Policy of the APIToken
func (APIToken) Policy() ent.Policy {
	return privacy.Policy{
		Mutation: privacy.MutationPolicy{
			privacy.APITokenMutationRuleFunc(func(ctx context.Context, am *generated.APITokenMutation) error {
				return am.CheckAccessForEdit(ctx)
			}),
			privacy.AlwaysDenyRule(),
		},
		Query: privacy.QueryPolicy{
			privacy.APITokenQueryRuleFunc(func(ctx context.Context, q *generated.APITokenQuery) error {
				return q.CheckAccess(ctx)
			}),
			privacy.AlwaysDenyRule(),
		},
	}
}
