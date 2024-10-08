package hooks

import (
	"context"

	"entgo.io/ent"

	"github.com/datum-cloud/datum-os/pkg/fgax"

	"github.com/datum-cloud/datum-os/internal/ent/generated"
	"github.com/datum-cloud/datum-os/internal/ent/generated/hook"
	"github.com/datum-cloud/datum-os/internal/ent/generated/privacy"
	"github.com/datum-cloud/datum-os/internal/ent/generated/tfasetting"
	"github.com/datum-cloud/datum-os/internal/ent/generated/user"
	"github.com/datum-cloud/datum-os/internal/ent/generated/usersetting"
	"github.com/datum-cloud/datum-os/internal/ent/privacy/rule"
	"github.com/datum-cloud/datum-os/internal/ent/privacy/token"
	"github.com/datum-cloud/datum-os/pkg/auth"
	"github.com/datum-cloud/datum-os/pkg/rout"
)

// HookUserSetting runs on user settings mutations and validates input on update
func HookUserSetting() ent.Hook {
	return hook.On(func(next ent.Mutator) ent.Mutator {
		return hook.UserSettingFunc(func(ctx context.Context, mutation *generated.UserSettingMutation) (generated.Value, error) {
			org, ok := mutation.DefaultOrgID()
			if ok && !allowDefaultOrgUpdate(ctx, mutation, org) {
				return nil, rout.InvalidField(rout.ErrOrganizationNotFound)
			}

			// delete tfa setting if tfa is disabled
			tfaEnabled, ok := mutation.IsTfaEnabled()
			if ok && !tfaEnabled {
				userID, err := auth.GetUserIDFromContext(ctx)
				if err != nil {
					return nil, err
				}

				_, err = mutation.Client().TFASetting.Delete().Where(tfasetting.OwnerID(userID)).Exec(ctx)
				if err != nil {
					return nil, err
				}
			}

			return next.Mutate(ctx, mutation)
		})
	}, ent.OpUpdate|ent.OpUpdateOne)
}

// allowDefaultOrgUpdate checks if the user has access to the organization being updated as their default org
func allowDefaultOrgUpdate(ctx context.Context, mutation *generated.UserSettingMutation, orgID string) bool {
	// allow if explicitly allowed
	if _, allow := privacy.DecisionFromContext(ctx); allow {
		return true
	}

	// allow for org invite tokens
	if rule.ContextHasPrivacyTokenOfType(ctx, &token.OrgInviteToken{}) {
		return true
	}

	// ensure user has access to the organization
	// the ID is always set on update
	userSettingID, _ := mutation.ID()

	owner, err := mutation.Client().
		User.
		Query().
		Where(
			user.HasSettingWith(usersetting.ID(userSettingID)),
		).
		Only(ctx)
	if err != nil {
		return false
	}

	req := fgax.AccessCheck{
		SubjectID:   owner.ID,
		SubjectType: auth.UserSubjectType,
		ObjectID:    orgID,
	}

	allow, err := mutation.Authz.CheckOrgReadAccess(ctx, req)
	if err != nil {
		return false
	}

	return allow
}
