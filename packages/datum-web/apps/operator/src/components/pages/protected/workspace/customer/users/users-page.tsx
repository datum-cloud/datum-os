'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'

import {
  GetOrganizationMembersQueryVariables,
  useGetOrganizationMembersQuery,
} from '@repo/codegen/src/schema'
import { exportExcel } from '@repo/common/csv'
import type { ColumnFiltersState, Row } from '@repo/ui/data-table'
import type { Datum } from '@repo/types'

import PageTitle from '@/components/page-title'
import { Loading } from '@/components/shared/loading/loading'
import { Error } from '@/components/shared/error/error'
import UsersControls from '@/components/pages/protected/workspace/customer/users/users-controls'
import UsersStatistics from '@/components/pages/protected/workspace/customer/users/users-statistics'
import { formatUsersExportData } from '@/utils/export'

// import UserDeleteDialog from './users-delete-dialog'
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
      const userCreatedAt = new Date(user.user.createdAt).getTime()
      return (
        userCreatedAt >= monthTimestamp &&
        (index === 0 || userCreatedAt < pastFiveMonths[index - 1])
      )
    })
    return {
      month: 5 - index,
      users: usersInMonth.length,
    }
  })

  return monthlyUsers
}

function getWeeklyUsers(users: Datum.User[]) {
  if (users.length === 0) return []
  const pastFiveWeeks = getPastFiveWeeks()

  const weeklyUsers = pastFiveWeeks.map((weekTimestamp, index) => {
    const usersInWeek = users.filter((user) => {
      const userCreatedAt = new Date(user.user.createdAt).getTime()
      return (
        userCreatedAt >= weekTimestamp &&
        (index === 0 || userCreatedAt < pastFiveWeeks[index - 1])
      )
    })
    return {
      week: 5 - index,
      users: usersInWeek.length,
    }
  })

  return weeklyUsers
}

// TODO: Remove this...
// MOCK DATA
const activeMonthlyUsers = [
  { month: '1', desktop: 100 },
  { month: '2', desktop: 250 },
  { month: '3', desktop: 200 },
  { month: '4', desktop: 450 },
  { month: '5', desktop: 500 },
]
const newUsersMonthly = [
  { month: '1', desktop: 209 },
  { month: '2', desktop: 73 },
  { month: '3', desktop: 237 },
  { month: '4', desktop: 277 },
  { month: '5', desktop: 304 },
]
const newUsersWeekly = [
  { week: '1', desktop: 110 },
  { week: '2', desktop: 84 },
  { week: '3', desktop: 200 },
  { week: '4', desktop: 305 },
  { week: '5', desktop: 491 },
]

const UsersPage: React.FC = () => {
  const [exportData, setExportData] = useState<Row<Datum.User>[]>([])
  const [openDeleteDialog, _setOpenDeleteDialog] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<Datum.User[]>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [query, setQuery] = useState('')
  const { data: session } = useSession()

  const variables: GetOrganizationMembersQueryVariables = {
    organizationId: session?.user.organization ?? '',
  }

  const [{ data, fetching, error }] = useGetOrganizationMembersQuery({
    variables,
    pause: !session,
  })

  const users: Datum.User[] = data?.organization?.members || []
  // TODO: Return status from the backend and reinstate the below rather than mock data...
  // const activeUsers = users.filter(user => user.user.setting.status === 'ACTIVE')
  // const activeUsersMonthly = users.length > 0 ? getMonthlyUsers(activeUsers) : []
  // const newUsersMonthly = users.length > 0 ? getMonthlyUsers(users) : []
  // const newUsersWeekly = users.length > 0 ? getWeeklyUsers(users) : []
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

  return (
    <div className={wrapper()}>
      <PageTitle title="Users" />
      {fetching ? (
        <Loading />
      ) : error ? (
        <Error />
      ) : (
        <>
          <UsersStatistics
            activeUsers={activeMonthlyUsers}
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
        </>
      )}
    </div>
  )
}

export default UsersPage
