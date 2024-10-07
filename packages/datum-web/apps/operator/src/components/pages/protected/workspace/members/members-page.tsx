'use client'

import { Import, PlusIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useMemo, useState } from 'react'

import {
  useGetInvitesQuery,
  useGetOrgMembersByOrgIdQuery,
} from '@repo/codegen/src/schema'
import { exportExcel } from '@repo/common/csv'
import type { Datum } from '@repo/types'
import { Button } from '@repo/ui/button'
import { Row } from '@repo/ui/data-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs'

import PageTitle from '@/components/page-title'
import { WorkspaceInviteForm } from '@/components/pages/protected/workspace/members/workspace-invite-form'
import { WorkspaceInvites } from '@/components/pages/protected/workspace/members/workspace-invites'
import Search from '@/components/shared/table-search/table-search'
import { canInviteAdminsRelation, useCheckPermissions } from '@/lib/authz/utils'
import { formatUsersExportData } from '@/utils/export'

import { MembersTable } from './members-table'
import { pageStyles } from './page.styles'

const MembersPage: React.FC = () => {
  const {
    wrapper,
    inviteCount,
    inviteRow,
    membersContent,
    membersSearchRow,
    membersButtons,
  } = pageStyles()
  const defaultTab = 'members'
  const [query, setQuery] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<Datum.OrgUser[]>([])
  const [exportData, setExportData] = useState<Row<Datum.OrgUser>[]>([])
  const [activeTab, setActiveTab] = useState(defaultTab)
  const { data: session } = useSession()
  const [{ data, fetching, error, stale }] = useGetInvitesQuery({
    pause: !session,
  })

  const [{ data: membersData, error: membersError, stale: membersStale }] =
    useGetOrgMembersByOrgIdQuery({
      variables: {
        where: { organizationID: session?.user.organization ?? '' },
      },
      pause: !session,
    })

  const members = useMemo(() => {
    return (membersData?.orgMemberships?.edges
      ?.map(
        (edge) =>
          edge?.node?.user && {
            ...edge?.node?.user,
            orgId: edge?.node?.organizationID,
            membershipId: edge?.node?.id,
            orgRole: edge?.node?.role,
            joinedAt: edge?.node?.createdAt,
          },
      )
      .filter(Boolean) || []) as Datum.OrgUser[]
  }, [membersData])

  function handleExport() {
    const now = new Date().toISOString()
    const formattedData = formatUsersExportData(exportData)
    exportExcel(`Users-${now}`, formattedData)
  }

  // Check if the user can invite admins or only members
  const { data: inviteAdminPermissions } = useCheckPermissions(
    session,
    canInviteAdminsRelation,
  )

  const numInvites = Array.isArray(data?.invites.edges)
    ? data?.invites.edges.length
    : 0

  return (
    <>
      <PageTitle title="Team Management" className="mb-10" />
      <Tabs
        variant="solid"
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value)
        }}
      >
        <TabsList>
          <TabsTrigger value="members">Member list</TabsTrigger>
          <TabsTrigger value="invites">
            <div className={inviteRow()}>
              <span>Invitations</span>
              {numInvites > 0 && (
                <div className={inviteCount()}>{numInvites}</div>
              )}
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="members" className={membersContent()}>
          <div className={membersSearchRow()}>
            <Search
              placeholder="Search team members"
              alignment="right"
              search={setQuery}
            />
            <div className={membersButtons()}>
              <Button
                variant="outline"
                icon={<Import />}
                iconPosition="left"
                onClick={handleExport}
              >
                Download CSV
              </Button>
              <Button
                icon={<PlusIcon />}
                iconPosition="left"
                onClick={() => setActiveTab('invites')}
              >
                Send an invite
              </Button>
            </div>
          </div>
          <MembersTable
            members={members}
            setGlobalFilter={setQuery}
            globalFilter={query}
            setSelection={setSelectedUsers}
            onRowsFetched={setExportData}
          />
        </TabsContent>
        <TabsContent value="invites">
          <div className={wrapper()}>
            <WorkspaceInviteForm
              inviteAdmins={inviteAdminPermissions?.allowed}
            />
            <WorkspaceInvites />
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}

export default MembersPage
