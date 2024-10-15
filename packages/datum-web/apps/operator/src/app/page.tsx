'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

import { useGetAllOrganizationsQuery } from '@repo/codegen/src/schema'
import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { Logo } from '@repo/ui/logo'

import { switchWorkspace } from '@/lib/user'

const Landing = () => {
  const router = useRouter()
  const { data: session, update } = useSession()

  const [{ data: allOrgs, fetching }] = useGetAllOrganizationsQuery({
    pause: !session,
  })

  const orgs = allOrgs?.organizations.edges || []

  async function handleWorkspaceRouting() {
    const nonPersonalOrgs = orgs.filter((org) => !org?.node?.personalOrg)
    const currentOrg = session?.user?.organization
    const isPersonalOrg = nonPersonalOrgs.some(
      (org) => org?.node?.id === currentOrg,
    )
    const firstOrg = nonPersonalOrgs[0]?.node?.id

    if (isPersonalOrg && nonPersonalOrgs.length > 0 && firstOrg) {
      const response = await switchWorkspace({
        target_organization_id: firstOrg,
      })

      if (session && response) {
        await update({
          ...response.session,
          user: {
            ...session.user,
            accessToken: response.access_token,
            organization: firstOrg,
            refreshToken: response.refresh_token,
          },
        })
      }

      // NOTE: Change this to the dashboard when the dashboard functionality is complete
      router.push(OPERATOR_APP_ROUTES.dashboard)
    } else {
      router.push(OPERATOR_APP_ROUTES.workspace)
    }
  }

  useEffect(() => {
    if (!fetching && session) {
      handleWorkspaceRouting()
    }
  }, [fetching, session, orgs, router])

  return (
    <main className="flex items-center justify-center h-screen relative bg-blackberry-800 dark:bg-peat-900">
      <div className="w-full relative z-3 px-4">
        <div className="mx-auto animate-pulse w-96">
          <Logo theme="dark" />
        </div>
        <h1 className="text-2xl text-center text-white mt-4">
          loading your platform...
        </h1>
      </div>
    </main>
  )
}

export default Landing
