'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import {
  useCreateOrganizationMutation,
  useGetAllOrganizationsQuery,
} from '@repo/codegen/src/schema'
import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { Button } from '@repo/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
  zodResolver,
} from '@repo/ui/form'
import { Info } from '@repo/ui/info'
import { Input } from '@repo/ui/input'
import { Panel, PanelHeader } from '@repo/ui/panel'
import { toast } from '@repo/ui/use-toast'

import PageTitle from '@/components/page-title'
import { createWorkspaceStyles } from '@/components/pages/protected/workspace/page.styles'
import { Error } from '@/components/shared/error/error'
import { Loading } from '@/components/shared/loading/loading'
import { switchWorkspace } from '@/lib/user'
import { WorkspaceNameInput, WorkspaceNameSchema } from '@/utils/schemas'

import { ExistingWorkspaces } from './workspace-existing'

const WorkspacePage = () => {
  const { push } = useRouter()
  const { data: sessionData, update: updateSession } = useSession()
  const [{ data: allOrgs, fetching, stale, error }] =
    useGetAllOrganizationsQuery({
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

  const { container } = createWorkspaceStyles()

  const form = useForm<WorkspaceNameInput>({
    resolver: zodResolver(WorkspaceNameSchema),
    defaultValues: {
      name: '',
    },
  })

  const {
    formState: { isSubmitting },
  } = form

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

  async function onSubmit(data: WorkspaceNameInput) {
    await createWorkspace({ name: data.name })
  }

  return (
    <>
      <PageTitle title="My Workspaces" className="mb-10" />
      <ExistingWorkspaces
        userId={userId}
        currentOrg={currentOrg}
        switchOrg={handleWorkspaceSwitch}
        personalOrg={personalOrg}
        orgs={orgs}
      />
      <div className={container()}>
        <Panel>
          <PanelHeader
            heading={creationHeading}
            subheading={creationSubheading}
            noBorder
          />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <Info>Please use 32 characters at maximum.</Info>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                {isSubmitting ? 'Creating workspace' : 'Create workspace'}
              </Button>
            </form>
          </Form>
        </Panel>
      </div>
    </>
  )
}

export default WorkspacePage
