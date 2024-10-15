'use client'

import { format } from 'date-fns'
import { AtSign, Settings } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useMemo } from 'react'

import { useGetOrgMembersByOrgIdQuery } from '@repo/codegen/src/schema'
import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { Datum } from '@repo/types'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/chart-card'

import PageTitle from '@/components/page-title'
import UsersStatistics from '@/components/pages/protected/workspace/customer/users/users-statistics'
import {
  getMonthlyUsers,
  getWeeklyUsers,
} from '@/components/pages/protected/workspace/customer/users/users-utils'
import { Error } from '@/components/shared/error/error'
import { Loading } from '@/components/shared/loading/loading'

import { pageStyles } from './page.styles'

const DashboardPage = () => {
  const { data: session } = useSession()
  const [{ data, fetching, error, stale }] = useGetOrgMembersByOrgIdQuery({
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
      .filter(Boolean) || []) as Datum.OrgUser[]
  }, [data])
  // TODO: Add this logic correctly, when we have access to active users by month in the future
  // const activeUsers = users.filter((user) => user.setting.status === 'ACTIVE')
  // const activeUsersMonthly =
  //   users.length > 0 ? getMonthlyUsers(activeUsers) : []
  const newUsersMonthly = getMonthlyUsers(users)
  const newUsersWeekly = getWeeklyUsers(users)
  const { card, cardContent, link, row } = pageStyles()

  if (error) {
    return <Error />
  }

  return (
    <section className="flex flex-col gap-6">
      <PageTitle
        title="Dashboard"
        description={
          <span className="text-sunglow-900">
            {format(new Date(), 'MMMM do, yyyy')}
          </span>
        }
        className="mb-10"
      />

      <div className={row()}>
        <UsersStatistics
          newUsersWeekly={newUsersWeekly}
          newUsersMonthly={newUsersMonthly}
          onDashboard
        />
      </div>
      <div className={row()}>
        <Card className={card()}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Settings className="text-blackberry-400" /> Workspace
            </CardTitle>
          </CardHeader>
          <CardContent className={cardContent()}>
            <Link
              href={OPERATOR_APP_ROUTES.workspaceSettings}
              className={link()}
            >
              Change workspace settings
            </Link>
            <Link
              href={OPERATOR_APP_ROUTES.workspaceMembers}
              className={link()}
            >
              Manage team members
            </Link>
          </CardContent>
        </Card>
        <Card className={card()}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <AtSign className="text-blackberry-400" />
              Marketing
            </CardTitle>
          </CardHeader>
          <CardContent className={cardContent()}>
            <Link href={OPERATOR_APP_ROUTES.contactLists} className={link()}>
              Manage lists
            </Link>
            <Link href={OPERATOR_APP_ROUTES.contacts} className={link()}>
              Manage contacts
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default DashboardPage
