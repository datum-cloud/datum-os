package hooks

import (
	"context"

	"entgo.io/ent"
	"github.com/datum-cloud/datum-os/pkg/entx"

	"github.com/datum-cloud/datum-os/internal/ent/generated"
	"github.com/datum-cloud/datum-os/internal/ent/generated/contactlistmembership"
	"github.com/datum-cloud/datum-os/internal/ent/generated/hook"
	"github.com/datum-cloud/datum-os/internal/ent/generated/privacy"
)

// HookDeleteContact runs on contact deletions to clean up personal organizations
func HookDeleteContact() ent.Hook {
	return func(next ent.Mutator) ent.Mutator {
		return hook.ContactFunc(func(ctx context.Context, mutation *generated.ContactMutation) (generated.Value, error) {
			if mutation.Op().Is(ent.OpDelete|ent.OpDeleteOne) || entx.CheckIsSoftDelete(ctx) {
				contactID, _ := mutation.ID()

				// get the contact so we can ultimately delete the contact list memberships
				contact, err := mutation.Client().Contact.Get(ctx, contactID)
				if err != nil {
					return nil, err
				}
				memberships, err := mutation.Client().Contact.QueryContactListMemberships(contact).All(ctx)
				if err != nil {
					return nil, err
				}

				// run the mutation first
				v, err := next.Mutate(ctx, mutation)
				if err != nil {
					return nil, err
				}

				membershipIDs := make([]string, 0, len(memberships))
				for _, membership := range memberships {
					membershipIDs = append(membershipIDs, membership.ID)
				}

				allowCtx := privacy.DecisionContext(ctx, privacy.Allow)
				if _, err := mutation.Client().
					ContactListMembership.
					Delete().
					Where(contactlistmembership.IDIn(membershipIDs...)).
					Exec(allowCtx); err != nil {
					return nil, err
				}

				return v, err
			}

			return next.Mutate(ctx, mutation)
		})
	}
}
