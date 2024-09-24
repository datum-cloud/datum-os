'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useGetAllOrganizationsQuery } from '@repo/codegen/src/schema'
import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { Logo } from '@repo/ui/logo'

const Landing = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const currentOrgId = session?.user.organization
  const [allOrgs] = useGetAllOrganizationsQuery({ pause: !session })
  const orgs = allOrgs.data?.organizations.edges || []

  const activeOrg = orgs
    .filter((org) => org?.node?.id === currentOrgId)
    .map((org) => org?.node)[0]

  const isWorkspaceSelected = !!activeOrg?.personalOrg

  useEffect(() => {
    if (isWorkspaceSelected) {
      router.push(OPERATOR_APP_ROUTES.dashboard)
    } else {
      router.push(OPERATOR_APP_ROUTES.workspace)
    }
  }, [router])

  return (
    <main className="flex items-center justify-center h-screen relative bg-winter-sky-900 dark:bg-peat-900">
      <div className="w-full relative z-3 px-4">
        <div className="mx-auto animate-pulse w-96">
          <Logo theme="dark" />
        </div>

        <h1 className="text-2xl text-center mt-4">loading your platform...</h1>
      </div>
    </main>
  )
}

export default Landing
