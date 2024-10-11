'use client'

// TODO: Refactor the API calls here to get a different segment of users
import { useSession } from 'next-auth/react'
import React, { useMemo, useState } from 'react'

import {
  useDeleteUserMutation,
  useGetOrgMembersByOrgIdQuery,
} from '@repo/codegen/src/schema'
import { exportExcel } from '@repo/common/csv'
import type { Datum } from '@repo/types'
import type { ColumnFiltersState, Row } from '@repo/ui/data-table'

import PageTitle from '@/components/page-title'
import UsersControls from '@/components/pages/protected/workspace/customer/users/users-controls'
import UsersStatistics from '@/components/pages/protected/workspace/customer/users/users-statistics'
import {
  getMonthlyUsers,
  getWeeklyUsers,
} from '@/components/pages/protected/workspace/customer/users/users-utils'
import { Error } from '@/components/shared/error/error'
import { Loading } from '@/components/shared/loading/loading'
import { canInviteAdminsRelation, useCheckPermissions } from '@/lib/authz/utils'
import { formatUsersExportData } from '@/utils/export'

import { pageStyles } from './page.styles'
import UserDeleteDialog from './users-delete-dialog'
import UsersTable from './users-table'

const UsersPage: React.FC = () => {
  const [exportData, setExportData] = useState<Row<Datum.OrgUser>[]>([])
  const [openDeleteDialog, _setOpenDeleteDialog] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<Datum.OrgUser[]>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [query, setQuery] = useState('')
  const { data: session } = useSession()
  const { data: inviteAdminPermissions } = useCheckPermissions(
    session,
    canInviteAdminsRelation,
  )

  const [_, deleteUser] = useDeleteUserMutation()
  const [{ data, fetching, error }] = useGetOrgMembersByOrgIdQuery({
    variables: {
      where: { organizationID: session?.user.organization ?? '' },
    },
    pause: !session,
  })

  const users = useMemo(() => {
    return (data?.orgMemberships?.edges
      ?.map(
        (edge) =>
          edge?.node?.user && {
            ...edge?.node?.user,
            orgRole: edge?.node?.role,
            joinedAt: edge?.node?.createdAt,
          },
      )
      .filter((user) => {
        // TODO: Implement this later...
        //  return  !!user && user.type === 'USER'
        return false
      }) || []) as Datum.OrgUser[]
  }, [data])
  // TODO: Add this logic correctly, when we have access to active users by month in the future
  // const activeUsers = users.filter((user) => user.setting.status === 'ACTIVE')
  // const activeUsersMonthly =
  //   users.length > 0 ? getMonthlyUsers(activeUsers) : []
  const newUsersMonthly = getMonthlyUsers(users)
  const newUsersWeekly = getWeeklyUsers(users)
  const { wrapper, header } = pageStyles()

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

  if (fetching) {
    return <Loading />
  }

  if (error) {
    console.error('GRAPHQL ERROR', error)
    return <Error />
  }

  async function handleDelete(deleteUserId: Datum.UserId) {
    await deleteUser({ deleteUserId })
  }

  return (
    <div className={wrapper()}>
      <PageTitle title="Users" />
      <UsersStatistics
        // activeUsers={activeUsersMonthly}
        newUsersMonthly={newUsersMonthly}
        newUsersWeekly={newUsersWeekly}
      />
      <div className={header()}>
        <UsersControls
          search={setQuery}
          onDelete={() => setOpenDeleteDialog(true)}
          onExport={handleExport}
          onFilter={setColumnFilters}
          selectedUsers={selectedUsers}
          admin={inviteAdminPermissions?.allowed}
        />
      </div>
      <UsersTable
        setGlobalFilter={setQuery}
        setSelection={setSelectedUsers}
        globalFilter={query}
        columnFilters={columnFilters}
        users={users}
        onRowsFetched={setExportData}
      />
      <UserDeleteDialog
        users={selectedUsers}
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        handleDelete={handleDelete}
      />
    </div>
  )
}

export default UsersPage
