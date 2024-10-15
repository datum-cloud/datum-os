'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import {
  UpdateOrganizationInput,
  useDeleteOrganizationMutation,
  useGetAllOrganizationsQuery,
  useUpdateOrganizationMutation,
} from '@repo/codegen/src/schema'
import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { toast } from '@repo/ui/use-toast'

import PageTitle from '@/components/page-title'
import { AvatarUpload } from '@/components/shared/avatar-upload/avatar-upload'
import { Error } from '@/components/shared/error/error'
import { Loading } from '@/components/shared/loading/loading'
import { canDeleteRelation, useCheckPermissions } from '@/lib/authz/utils'

import { pageStyles } from './page.styles'
import { WorkspaceDelete } from './workspace-delete'
import { WorkspaceEmailForm } from './workspace-email-form'
import { WorkspaceNameForm } from './workspace-name-form'

const WorkspaceSettingsPage = () => {
  const { push } = useRouter()
  const { wrapper } = pageStyles()
  const { data: sessionData, update } = useSession()
  const currentOrgId = sessionData?.user.organization
  const [allOrgs] = useGetAllOrganizationsQuery({ pause: !sessionData })
  const currentWorkspace = allOrgs.data?.organizations.edges?.filter(
    (org) => org?.node?.id === currentOrgId,
  )[0]?.node
  const [{ fetching, error, stale }, updateOrganization] =
    useUpdateOrganizationMutation()
  const [{ fetching: isDeleting, error: deleteError }, deleteOrganization] =
    useDeleteOrganizationMutation()

  const { data: deletePermissions } = useCheckPermissions(
    sessionData,
    canDeleteRelation,
  )

  async function updateWorkspace(input: UpdateOrganizationInput) {
    await updateOrganization({
      updateOrganizationId: currentOrgId,
      input,
    })

    if (error) {
      console.error(error)
      toast({
        title: 'Error updating workspace',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Successfully updated workspace',
        variant: 'success',
      })
    }
  }

  async function updateWorkspaceAvatar(url: string) {
    await updateWorkspace({
      avatarLocalFile: url,
    })
  }

  async function handleDelete() {
    const response = await deleteOrganization({
      deleteOrganizationId: currentOrgId,
    })

    if (deleteError) {
      console.error(error)
      toast({
        title: 'Error deleting workspace',
        variant: 'destructive',
      })
    } else {
      if (response.extensions && sessionData) {
        await update({
          ...sessionData,
          user: {
            ...sessionData.user,
            accessToken: response.extensions.auth.access_token,
            organization: response.extensions.auth.authorized_organization,
            refreshToken: response.extensions.auth.refresh_token,
          },
        })
      }

      toast({
        title: 'Successfully deleted workspace',
        variant: 'success',
      })

      push(OPERATOR_APP_ROUTES.workspace)
    }
  }

  const avatar =
    currentWorkspace?.avatarLocalFile || currentWorkspace?.avatarRemoteURL || ''

  return (
    <>
      <PageTitle title="General Settings" className="mb-10" />
      <div className={wrapper()}>
        <WorkspaceNameForm
          name={currentWorkspace?.name || ''}
          setName={updateWorkspace}
        />
        <AvatarUpload
          avatar={avatar}
          setAvatar={updateWorkspaceAvatar}
          title="Workspace logo"
          imageType="logo"
          noBorder
          fallbackText={currentWorkspace?.name}
        />
        <WorkspaceEmailForm
          email={currentWorkspace?.setting?.billingEmail || ''}
          setEmail={updateWorkspace}
        />
        {deletePermissions?.allowed && (
          <WorkspaceDelete
            name={currentWorkspace?.name || ''}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </>
  )
}

export default WorkspaceSettingsPage
