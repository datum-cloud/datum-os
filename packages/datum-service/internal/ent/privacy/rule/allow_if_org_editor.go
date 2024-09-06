package rule

import (
	"context"

	"github.com/datum-cloud/datum-os/internal/ent/generated/privacy"
	"github.com/datum-cloud/datum-os/pkg/auth"
	"github.com/datum-cloud/datum-os/pkg/fgax"
	"github.com/datum-cloud/datum-os/pkg/middleware/transaction"
)

// AllowIfOrgEditor ensures that a given user has edit permissions in their currently active organization
func AllowIfOrgEditor() privacy.MutationRule {
	return privacy.ContextQueryMutationRule(
		func(ctx context.Context) error {
			ac := fgax.AccessCheck{
				Relation:    fgax.CanEdit,
				ObjectType:  "organization",
				SubjectType: auth.GetAuthzSubjectType(ctx),
			}

			var err error
			ac.ObjectID, err = auth.GetOrganizationIDFromContext(ctx)
			if err != nil {
				return privacy.Skipf("unable to check access, %s", err.Error())
			}

			ac.SubjectID, err = auth.GetUserIDFromContext(ctx)
			if err != nil {
				return err
			}

			access, err := transaction.FromContext(ctx).Authz.CheckOrgWriteAccess(ctx, ac)
			if err != nil {
				return privacy.Skipf("unable to check access, %s", err.Error())
			}

			if access {
				return privacy.Allow
			}

			return privacy.Skip
		},
	)
}
