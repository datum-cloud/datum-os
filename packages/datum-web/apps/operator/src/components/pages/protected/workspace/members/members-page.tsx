'use client'

import { ChevronDown, Import, Minus, PlusIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useMemo, useState } from 'react'

import {
  useDeleteInviteMutation,
  useGetInvitesQuery,
  useGetOrgMembersByOrgIdQuery,
  useRemoveUserFromOrgMutation,
} from '@repo/codegen/src/schema'
import { exportExcel } from '@repo/common/csv'
import { TOAST_DURATION } from '@repo/constants'
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
import {
  canDeleteRelation,
  canInviteAdminsRelation,
  useCheckPermissions,
} from '@/lib/authz/utils'
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
  const [{ data: invitesData }, refetchInvites] = useGetInvitesQuery({
    pause: !session,
  })
  const [{ data: membersData }, refetchMembers] = useGetOrgMembersByOrgIdQuery({
    variables: {
      where: { organizationID: session?.user.organization ?? '' },
    },
    pause: !session,
  })
  const [_member, removeUserFromOrg] = useRemoveUserFromOrgMutation()
  const [_invite, deleteInvite] = useDeleteInviteMutation()
  const { data: adminPrivileges } = useCheckPermissions(
    session,
    canDeleteRelation,
  )

  // Check if the user can invite admins or only members
  const { data: invitationPermissions } = useCheckPermissions(session, canInviteAdminsRelation)

  const invites = useMemo(() => {
    return (invitesData?.invites?.edges
      ?.map((edge) => edge?.node)
      .filter(Boolean) || []) as Datum.Invitation[]
  }, [invitesData])

  const members = useMemo(() => {
    return (membersData?.orgMemberships?.edges
      ?.map(
        (edge) =>
          edge?.node?.user && {
            ...edge?.node?.user,
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

  async function handleDeleteInvite(inviteIds: Datum.InvitationId[]) {
    try {
      for (const id of inviteIds) {
        const result = await deleteInvite({ deleteInviteId: id })

        if (result.error) {
          toast({
            title: `Error ${result.error.message}`,
            variant: 'destructive',
            duration: TOAST_DURATION,
          })
        } else {
          toast({
            title: 'Invite deleted successfully',
            variant: 'success',
            duration: TOAST_DURATION,
          })

          refetchInvites({
            requestPolicy: 'network-only',
          })
        }
      }
    } catch (err) {
      toast({
        title: `Unexpected error: ${(err as Error).message}`,
        variant: 'destructive',
        duration: TOAST_DURATION,
      })
    }
  }

  async function handleDelete(members: Datum.OrgUser[]) {
    try {
      const ids = members.map(({ membershipId }) => membershipId)
      for (const id of ids) {
        const result = await removeUserFromOrg({ deleteOrgMembershipId: id })

        if (result.error) {
          setOpenDeleteDialog(false)
          toast({
            title: `Error ${result.error.message}`,
            variant: 'destructive',
            duration: TOAST_DURATION,
          })
        } else {
          setOpenDeleteDialog(false)
          toast({
            title: 'Team member removed successfully',
            variant: 'success',
            duration: TOAST_DURATION,
          })
          refetchMembers({ requestPolicy: 'network-only' })
        }
      }
    } catch (err) {
      setOpenDeleteDialog(false)
      toast({
        title: `Unexpected error: ${(err as Error).message}`,
        variant: 'destructive',
        duration: TOAST_DURATION,
      })
    }
  }

  function handleDeleteModal(members: Datum.OrgUser[]) {
    setSelectedUsers(members)
    setOpenDeleteDialog(true)
  }

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
          <TabsTrigger value="members">Team members</TabsTrigger>
          <TabsTrigger value="invites">
            <div className={inviteRow()}>
              <span>Invitations</span>
              {invites.length > 0 && (
                <div className={inviteCount()}>{invites.length}</div>
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
            handleDelete={handleDeleteModal}
            isAdmin={adminPrivileges?.allowed}
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
            <InviteForm
              inviteAdmins={invitationPermissions?.allowed}
              refetchInvites={refetchInvites}
            />
            <InviteTable invites={invites} handleDelete={handleDeleteInvite} />
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}

export default MembersPage
