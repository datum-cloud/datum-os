import { useRouter } from 'next/navigation'

import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { Panel, PanelHeader } from '@repo/ui/panel'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/avatar'
import { Button } from '@repo/ui/button'
import { Tag } from '@repo/ui/tag'
import { Datum } from '@repo/types'

import { existingWorkspacesStyles } from './page.styles'

type ExistingWorkspacesProps = {
  userId: Datum.UserId
  personalOrg: any
  currentOrg: any
  switchOrg: (orgId: Datum.OrganisationId) => void
  orgs: any[]
}

export const ExistingWorkspaces = ({
  userId,
  currentOrg,
  switchOrg,
  personalOrg,
  orgs,
}: ExistingWorkspacesProps) => {
  const { push } = useRouter()
  const { container, orgWrapper, orgInfo, orgSelect, orgTitle } =
    existingWorkspacesStyles()

  return (
    <div className={container()}>
      <Panel>
        <PanelHeader heading="Existing workspaces" noBorder />
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
                  onClick={() => switchOrg(personalOrg?.node?.id)}
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
          const defaultRole =
            org?.node?.setting?.createdBy === userId ? 'OWNER' : 'MEMBER'
          const role =
            org?.node?.members?.find((member: any) => member.id === userId)
              ?.role || defaultRole
          const name = org?.node?.displayName
          const avatar =
            org?.node?.avatarLocalFile || org?.node?.avatarRemoteUrl || ''

          return (
            <div key={org?.node?.id} className={`${orgWrapper()} group`}>
              <div>
                <Avatar variant="large">
                  {avatar && <AvatarImage src={avatar} />}
                  <AvatarFallback>
                    {name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className={orgInfo()}>
                <div className={orgTitle()}>{name}</div>
                <Tag>{role}</Tag>
              </div>
              <div className={orgSelect()}>
                {currentOrg !== org?.node?.id ? (
                  <Button
                    variant="sunglow"
                    size="md"
                    onClick={() => switchOrg(org?.node?.id)}
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
