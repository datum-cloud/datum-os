'use client'

import { ChevronDown, Import, Minus, PlusIcon, Trash } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useMemo, useState } from 'react'

import {
  useGetInvitesQuery,
  useGetOrgMembersByOrgIdQuery,
  useRemoveUserFromOrgMutation,
} from '@repo/codegen/src/schema'
import { exportExcel } from '@repo/common/csv'
import type { Datum } from '@repo/types'
import { Button } from '@repo/ui/button'
import { Row } from '@repo/ui/data-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs'
import { useToast } from '@repo/ui/use-toast'

import PageTitle from '@/components/page-title'
import Search from '@/components/shared/table-search/table-search'
import { canInviteAdminsRelation, useCheckPermissions } from '@/lib/authz/utils'
import { formatUsersExportData } from '@/utils/export'

import { InviteForm } from './invite-form'
import { InviteTable } from './invite-table'
import MembersDeleteDialog from './members-delete-dialog'
import { MembersTable } from './members-table'
import { pageStyles } from './page.styles'

const MembersPage: React.FC = () => {
  const { toast } = useToast()
  const {
    wrapper,
    inviteCount,
    inviteRow,
    membersContent,
    membersSearchRow,
    membersButtons,
    membersDropdownItem,
    membersDropdownIcon,
  } = pageStyles()
  const defaultTab = 'members'
  const [query, setQuery] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<Datum.OrgUser[]>([])
  const [openDeleteDialog, _setOpenDeleteDialog] = useState(false)
  const [exportData, setExportData] = useState<Row<Datum.OrgUser>[]>([])
  const [activeTab, setActiveTab] = useState(defaultTab)
  const { data: session } = useSession()
  const [{ data, fetching, error, stale }] = useGetInvitesQuery({
    pause: !session,
  })
  const [{ fetching: isDeleting, error: deletionError }, removeUserFromOrg] =
    useRemoveUserFromOrgMutation()

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

  function setOpenDeleteDialog(input: boolean) {
    _setOpenDeleteDialog(input)
    // NOTE: This is needed to close the dialog without removing pointer events per https://github.com/shadcn-ui/ui/issues/468
    setTimeout(() => (document.body.style.pointerEvents = ''), 500)
  }

  async function handleDelete(members: Datum.OrgUser[]) {
    const ids = members.map(({ id }) => id)
    for (const id of ids) {
      await removeUserFromOrg({ deleteOrgMembershipId: id })
    }

    if (error) {
      toast({
        title: `Error ${error.message}`,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Team member removed successfully',
        variant: 'success',
      })
    }
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" icon={<ChevronDown />}>
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="px-2 py-2.5">
                  <DropdownMenuItem
                    onClick={handleExport}
                    className={membersDropdownItem()}
                  >
                    <Import
                      size={18}
                      className="text-blackberry-400 transform rotate-180"
                    />
                    Export
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setOpenDeleteDialog(true)}
                    disabled={selectedUsers.length === 0}
                    className={membersDropdownItem()}
                  >
                    <Minus size={18} className={membersDropdownIcon()} />
                    Remove team members
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
            handleDelete={handleDelete}
          />
          <MembersDeleteDialog
            members={selectedUsers}
            open={openDeleteDialog}
            setOpen={setOpenDeleteDialog}
            handleDelete={handleDelete}
          />
        </TabsContent>
        <TabsContent value="invites">
          <div className={wrapper()}>
            <InviteForm inviteAdmins={inviteAdminPermissions?.allowed} />
            <InviteTable />
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}

export default MembersPage
