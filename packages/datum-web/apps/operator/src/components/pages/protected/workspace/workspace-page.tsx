'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { OPERATOR_APP_ROUTES } from '@repo/constants'
import {
  useCreateOrganizationMutation,
  useGetAllOrganizationsQuery,
} from '@repo/codegen/src/schema'
import { toast } from '@repo/ui/use-toast'

import PageTitle from '@/components/page-title'
import { Error } from '@/components/shared/error/error'
import { Loading } from '@/components/shared/loading/loading'
import { switchWorkspace } from '@/lib/user'
import { WorkspaceNameInput } from '@/utils/schemas'

import { CreateWorkspaceForm } from './workspace-create'
import { ExistingWorkspaces } from './workspace-existing'

const WorkspacePage = () => {
  const { push } = useRouter()
  const { data: sessionData, update: updateSession } = useSession()
  const [{ data: allOrgs, fetching, error }] = useGetAllOrganizationsQuery({
    pause: !sessionData,
  })
  const userId = sessionData?.user.userId
  const [{ error: createError }, addOrganization] =
    useCreateOrganizationMutation()
  const numOrgs = allOrgs?.organizations?.edges?.length ?? 0
  const creationSubheading =
    numOrgs === 0
      ? 'To get started create a workspace for your business or department.'
      : undefined
  const creationHeading =
    numOrgs === 0 ? 'Create your first workspace' : 'Create a workspace'
  const personalOrg = allOrgs?.organizations.edges?.find(
    (org) => org?.node?.personalOrg,
  )
  const orgs =
    allOrgs?.organizations.edges?.filter((org) => !org?.node?.personalOrg) || []
  const currentOrg = sessionData?.user.organization

  async function handleWorkspaceSwitch(orgId?: string) {
    if (orgId) {
      const response = await switchWorkspace({
        target_organization_id: orgId,
      })

      if (sessionData && response) {
        await updateSession({
          ...response.session,
          user: {
            ...sessionData.user,
            accessToken: response.access_token,
            organization: orgId,
            refreshToken: response.refresh_token,
          },
        })
      }

      push(OPERATOR_APP_ROUTES.dashboard)
    }
  }

  async function createWorkspace(data: WorkspaceNameInput) {
    await addOrganization({
      input: { name: data.name, displayName: data.name },
    })

    if (createError) {
      toast({
        title: 'Error creating workspace',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Workspace created',
        variant: 'success',
      })
    }
  }

  return (
    <>
      <PageTitle title="My Workspaces" className="mb-10" />
      {fetching ? (
        <Loading />
      ) : error ? (
        <Error />
      ) : (
        <>
          <ExistingWorkspaces
            userId={userId}
            currentOrg={currentOrg}
            switchOrg={handleWorkspaceSwitch}
            personalOrg={personalOrg}
            orgs={orgs}
          />
          <CreateWorkspaceForm
            heading={creationHeading}
            subheading={creationSubheading}
            createWorkspace={createWorkspace}
          />
        </>
      )}
    </>
  )
}

export default WorkspacePage
