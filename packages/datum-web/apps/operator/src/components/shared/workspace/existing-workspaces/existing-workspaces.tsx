import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { Panel, PanelHeader } from '@repo/ui/panel'
import { Avatar, AvatarFallback } from '@repo/ui/avatar'
import { Button } from '@repo/ui/button'
import { Tag } from '@repo/ui/tag'

import { switchWorkspace } from '@/lib/user'

import { existingWorkspacesStyles } from './existing-workspaces.styles'

type ExistingWorkspacesProps = {
  personalOrg: any
  orgs: any[]
}

export const ExistingWorkspaces = ({
  personalOrg,
  orgs,
}: ExistingWorkspacesProps) => {
  const { push } = useRouter()
  const { data: sessionData, update: updateSession } = useSession()
  const currentOrg = sessionData?.user.organization
  const { container, orgWrapper, orgInfo, orgSelect, orgTitle } =
    existingWorkspacesStyles()

  const handleWorkspaceSwitch = async (orgId?: string) => {
    if (orgId) {
      const response = await switchWorkspace({
        target_organization_id: orgId,
      })

      if (sessionData && response) {
        await updateSession({
          ...response.session,
          user: {
            ...sessionData.user,
            accessToken: response.access_token,
            organization: orgId,
            refreshToken: response.refresh_token,
          },
        })
      }

      push(OPERATOR_APP_ROUTES.dashboard)
    }
  }

  return (
    <div className={container()}>
      <Panel>
        <PanelHeader heading="Existing workspaces" />
        {personalOrg && (
          <div key={personalOrg?.node?.id} className={`${orgWrapper()} group`}>
            <div>
              <Avatar variant="large">
                <AvatarFallback className="bg-blackberry-700">
                  {personalOrg?.node?.displayName.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className={orgInfo()}>
              <div className={orgTitle()}>{personalOrg?.node?.displayName}</div>
              <Tag>Personal Workspace</Tag>
            </div>
            <div className={orgSelect()}>
              {currentOrg !== personalOrg?.node?.id ? (
                <Button
                  variant="sunglow"
                  size="md"
                  onClick={() => handleWorkspaceSwitch(personalOrg?.node?.id)}
                >
                  Select
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => push(OPERATOR_APP_ROUTES.dashboard)}
                >
                  Go to Dashboard
                </Button>
              )}
            </div>
          </div>
        )}
        {orgs?.map((org) => {
          const role = org?.node?.members?.[0]?.role ?? 'Owner'

          return (
            <div key={org?.node?.id} className={`${orgWrapper()} group`}>
              <div>
                <Avatar variant="large">
                  <AvatarFallback>
                    {org?.node?.displayName.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className={orgInfo()}>
                <div className={orgTitle()}>{org?.node?.displayName}</div>
                <Tag>{role}</Tag>
              </div>
              <div className={orgSelect()}>
                {currentOrg !== org?.node?.id ? (
                  <Button
                    variant="sunglow"
                    size="md"
                    onClick={() => handleWorkspaceSwitch(org?.node?.id)}
                  >
                    Select
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => push(OPERATOR_APP_ROUTES.dashboard)}
                  >
                    Go to Dashboard
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </Panel>
    </div>
  )
}
