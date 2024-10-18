import { Session } from 'next-auth'
import useSWR from 'swr'

import { OPERATOR_API_ROUTES, SERVICE_APP_ROUTES } from '@repo/constants'
import { datumAPIUrl } from '@repo/dally/auth'

// high level relation names
export const canViewRelation = 'can_view'
export const canEditRelation = 'can_edit'
export const canDeleteRelation = 'can_delete'
export const accessRelation = 'access'

// fine grained relation names used in the check access endpoint
export const canInviteAdminsRelation = 'can_invite_admins'
export const inviteMembersRelation = 'can_invite_members'
export const auditLogViewRelation = 'audit_log_viewer'

// object types used in the check access endpoint
export const organizationObject = 'organization'
export const groupObject = 'group'
export const featureObject = 'feature'

/*
 * CheckTuple includes the payload required for the check access endpoint
 *
 * @objectId: the id of the object being checked, usually the organization id
 * @objectType: the type of the object being checked, usually organization
 * @relation: the relation being checked
 */
export type CheckTuple = {
  objectId: string
  objectType: string
  relation: string
}

/*
 * Returns if the current user has access to the specified relation
 * @param session: the current user's session
 * @param relation: the relation to check
 *
 */
export function useCheckPermissions(session: Session | null, relation: string) {
  // get the current user's organization and access token for authorization
  const accessToken = session?.user?.accessToken
  const currentOrgId = session?.user.organization

  const { data, error, isLoading } = useSWR(
    [OPERATOR_API_ROUTES.permissions, accessToken, currentOrgId, relation],
    async ([url, token, orgId, rel]) => {
      if (!token || !orgId) return null

      const updatedPayload: CheckTuple = {
        relation: rel,
        objectType: organizationObject,
        objectId: orgId,
      }

      const updatedHeaders: HeadersInit = {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }

      return (
        await fetch(url, {
          method: 'POST',
          headers: updatedHeaders,
          body: JSON.stringify(updatedPayload),
          credentials: 'include',
        })
      ).json()
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      refreshInterval: 0,
      revalidateIfStale: false,
    },
  )

  return { data, error, isLoading }
}
