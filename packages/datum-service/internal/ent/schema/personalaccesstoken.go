package schema

import (
	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"

	emixin "github.com/datum-cloud/datum-os/pkg/entx/mixin"
	"github.com/flume/enthistory"

	"github.com/datum-cloud/datum-os/internal/ent/generated/privacy"
	"github.com/datum-cloud/datum-os/internal/ent/hooks"
	"github.com/datum-cloud/datum-os/internal/ent/interceptors"
	"github.com/datum-cloud/datum-os/internal/ent/mixin"
	"github.com/datum-cloud/datum-os/internal/ent/privacy/rule"
	"github.com/datum-cloud/datum-os/pkg/keygen"
)

// PersonalAccessToken holds the schema definition for the PersonalAccessToken entity.
type PersonalAccessToken struct {
	ent.Schema
}

// Fields of the PersonalAccessToken
func (PersonalAccessToken) Fields() []ent.Field {
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
				token := keygen.PrefixedSecret("dtmp") // datum token prefix
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

// Edges of the PersonalAccessToken
func (PersonalAccessToken) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("organizations", Organization.Type).
			Ref("personal_access_tokens").
			Comment("the organization(s) the token is associated with"),
		edge.To("events", Event.Type),
	}
}

// Indexes of the PersonalAccessToken
func (PersonalAccessToken) Indexes() []ent.Index {
	return []ent.Index{
		// non-unique index.
		index.Fields("token"),
	}
}

// Mixin of the PersonalAccessToken
func (PersonalAccessToken) Mixin() []ent.Mixin {
	return []ent.Mixin{
		emixin.AuditMixin{},
		mixin.SoftDeleteMixin{},
		emixin.IDMixin{},
		emixin.TagMixin{},
		UserOwnedMixin{
			Ref:         "personal_access_tokens",
			AllowUpdate: false,
			// skip the interceptor for Only queries when the token is being checked
			// and we do not yet know the organization
			SkipInterceptor: interceptors.SkipOnlyQuery,
		},
	}
}

// Annotations of the PersonalAccessToken
func (PersonalAccessToken) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.QueryField(),
		entgql.RelayConnection(),
		entgql.Mutations(entgql.MutationCreate(), (entgql.MutationUpdate())),
		enthistory.Annotations{
			Exclude: true,
		},
	}
}

// Hooks of the PersonalAccessToken
func (PersonalAccessToken) Hooks() []ent.Hook {
	return []ent.Hook{
		hooks.HookCreatePersonalAccessToken(),
		hooks.HookUpdatePersonalAccessToken(),
	}
}

// Interceptors of the PersonalAccessToken
func (PersonalAccessToken) Interceptors() []ent.Interceptor {
	return []ent.Interceptor{
		interceptors.InterceptorPat(),
	}
}

// Policy of the PersonalAccessToken
func (PersonalAccessToken) Policy() ent.Policy {
	return privacy.Policy{
		Mutation: privacy.MutationPolicy{
			rule.AllowMutationAfterApplyingOwnerFilter(),
			privacy.AlwaysAllowRule(),
		},
		Query: privacy.QueryPolicy{
			privacy.AlwaysAllowRule(),
		},
	}
}
