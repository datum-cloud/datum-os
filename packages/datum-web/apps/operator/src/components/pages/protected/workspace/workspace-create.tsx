'use client'

import { Panel, PanelHeader } from '@repo/ui/panel'
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
  useForm,
  zodResolver,
} from '@repo/ui/form'
import { Info } from '@repo/ui/info'
import { Input } from '@repo/ui/input'
import { Button } from '@repo/ui/button'

import { WorkspaceNameInput, WorkspaceNameSchema } from '@/utils/schemas'

import { createWorkspaceStyles } from './page.styles'

type CreateWorkspaceFormProps = {
  heading?: string
  subheading?: string
  createWorkspace(data: WorkspaceNameInput): Promise<void>
}

export const CreateWorkspaceForm = ({
  heading,
  subheading,
  createWorkspace,
}: CreateWorkspaceFormProps) => {
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

  async function onSubmit(data: WorkspaceNameInput) {
    createWorkspace({ name: data.name })
  }

  return (
    <div className={container()}>
      <Panel>
        <PanelHeader heading={heading} subheading={subheading} noBorder />
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
  )
}
