'use client'

import React, { useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'

import { useGetOrgMembersByOrgIdQuery } from '@repo/codegen/src/schema'
import { exportExcel } from '@repo/common/csv'
import type { ColumnFiltersState, Row } from '@repo/ui/data-table'
import type { Datum } from '@repo/types'

import PageTitle from '@/components/page-title'
import { Loading } from '@/components/shared/loading/loading'
import { Error } from '@/components/shared/error/error'
import UsersControls from '@/components/pages/protected/workspace/customer/users/users-controls'
import UsersStatistics from '@/components/pages/protected/workspace/customer/users/users-statistics'
import { formatUsersExportData } from '@/utils/export'

import UserDeleteDialog from './users-delete-dialog'
import UsersTable from './users-table'
import { pageStyles } from './page.styles'

function getPastFiveMonths() {
  const now = new Date()
  const months = []

  for (let i = 0; i < 5; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(date.getTime())
  }

  return months
}

function getPastFiveWeeks() {
  const now = new Date()
  const weeks = []

  for (let i = 0; i < 5; i++) {
    const date = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000)
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - date.getDay()) // Sunday considered the start of the week
    weeks.push(date.getTime())
  }

  return weeks
}

function getMonthlyUsers(users: Datum.User[]) {
  if (users.length === 0) return []
  const pastFiveMonths = getPastFiveMonths()

  const monthlyUsers = pastFiveMonths.map((monthTimestamp, index) => {
    const usersInMonth = users.filter((user) => {
      const userCreatedAt = new Date(user.createdAt).getTime()
      return (
        userCreatedAt >= monthTimestamp &&
        (index === 0 || userCreatedAt < pastFiveMonths[index - 1])
      )
    })
    return {
      month: 5 - index,
      desktop: usersInMonth.length,
    }
  })

  return monthlyUsers.reverse()
}

function getWeeklyUsers(users: Datum.User[]) {
  if (users.length === 0) return []
  const pastFiveWeeks = getPastFiveWeeks()

  const weeklyUsers = pastFiveWeeks.map((weekTimestamp, index) => {
    const usersInWeek = users.filter((user) => {
      const userCreatedAt = new Date(user.createdAt).getTime()
      return (
        userCreatedAt >= weekTimestamp &&
        (index === 0 || userCreatedAt < pastFiveWeeks[index - 1])
      )
    })
    return {
      week: 5 - index,
      desktop: usersInWeek.length,
    }
  })

  return weeklyUsers.reverse()
}

const UsersPage: React.FC = () => {
  const [exportData, setExportData] = useState<Row<Datum.User>[]>([])
  const [openDeleteDialog, _setOpenDeleteDialog] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<Datum.User[]>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [query, setQuery] = useState('')
  const { data: session } = useSession()

  const [{ data, fetching, error }] = useGetOrgMembersByOrgIdQuery({
    variables: {
      where: { organizationID: session?.user.organization ?? '' },
    },
    pause: !session,
  })

  const users = useMemo(() => {
    return (data?.orgMemberships?.edges
      ?.map((edge) => edge?.node?.user)
      .filter(Boolean) || []) as Datum.User[]
  }, [data])
  const activeUsers = users.filter((user) => user.setting.status === 'ACTIVE')
  const activeUsersMonthly =
    users.length > 0 ? getMonthlyUsers(activeUsers) : []
  const newUsersMonthly = users.length > 0 ? getMonthlyUsers(users) : []
  const newUsersWeekly = users.length > 0 ? getWeeklyUsers(users) : []
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
    return <Error />
  }

  return (
    <div className={wrapper()}>
      <PageTitle title="Users" />
      <UsersStatistics
        activeUsers={activeUsersMonthly}
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
      />
    </div>
  )
}

export default UsersPage
