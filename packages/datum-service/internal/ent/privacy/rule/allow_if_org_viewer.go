package rule

import (
	"context"

	"github.com/datum-cloud/datum-os/internal/ent/generated"
	"github.com/datum-cloud/datum-os/internal/ent/generated/privacy"
	"github.com/datum-cloud/datum-os/pkg/auth"
	"github.com/datum-cloud/datum-os/pkg/fgax"
	"github.com/datum-cloud/datum-os/pkg/middleware/transaction"
)

// AllowIfOrgViewer
func AllowIfOrgViewer() privacy.QueryRuleFunc {
	return privacy.QueryRuleFunc(
		func(ctx context.Context, q generated.Query) error {
			ac := fgax.AccessCheck{
				Relation:    fgax.CanView,
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

			access, err := transaction.FromContext(ctx).Authz.CheckOrgReadAccess(ctx, ac)
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
