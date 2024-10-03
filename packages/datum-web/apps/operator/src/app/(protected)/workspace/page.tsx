'use client'

import { useSession } from 'next-auth/react'
import React from 'react'

import { useGetAllOrganizationsQuery } from '@repo/codegen/src/schema'

import { CreateWorkspaceForm } from '@/components/shared/workspace/create-workspace/create-workspace'
import { ExistingWorkspaces } from '@/components/shared/workspace/existing-workspaces/existing-workspaces'
import PageTitle from '@/components/page-title'
import { Error } from '@/components/shared/error/error'

const WorkspaceLanding: React.FC = () => {
  const { data: sessionData } = useSession()
  const [allOrgs] = useGetAllOrganizationsQuery({ pause: !sessionData })

  const data = allOrgs?.data
  if (allOrgs?.error) {
    return <Error />
  }

  const renderWorkspaces = () => {
    if (!data) return null
    const personalOrg = data.organizations.edges?.find(
      (org) => org?.node?.personalOrg,
    )
    const orgs =
      data.organizations.edges?.filter((org) => !org?.node?.personalOrg) || []

    if ([personalOrg, ...orgs].length === 0) return null

    return <ExistingWorkspaces personalOrg={personalOrg} orgs={orgs} />
  }

  return (
    <section>
      <PageTitle title="My Workspaces" className="mb-10" />
      {renderWorkspaces()}
      <CreateWorkspaceForm />
    </section>
  )
}

export default WorkspaceLanding
