'use client'

import { useEffect, useState } from 'react'

import { Input } from '@repo/ui/input'
import { Panel, PanelHeader } from '@repo/ui/panel'
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
  useForm,
  zodResolver,
} from '@repo/ui/form'
import { Button } from '@repo/ui/button'

import { RESET_SUCCESS_STATE_MS } from '@/constants'
import { WorkspaceNameInput, WorkspaceNameSchema } from '@/utils/schemas'

type WorkspaceNameFormProps = {
  name: string
  setName(input: { name: string; displayName: string }): Promise<void>
}

const WorkspaceNameForm = ({ name, setName }: WorkspaceNameFormProps) => {
  const [showSaved, setShowSaved] = useState(false)
  const form = useForm<WorkspaceNameInput>({
    resolver: zodResolver(WorkspaceNameSchema),
    defaultValues: {
      name,
    },
  })

  const {
    formState: { isSubmitting },
  } = form

  async function onSubmit(data: WorkspaceNameInput) {
    await setName({ name: data.name, displayName: data.name })

    setShowSaved(true)
  }

  useEffect(() => {
    form.setValue('name', name)
  }, [name])

  useEffect(() => {
    if (showSaved) {
      const timer = setTimeout(() => {
        setShowSaved(false)
      }, RESET_SUCCESS_STATE_MS)
      return () => clearTimeout(timer)
    }
  }, [showSaved])

  return (
    <Panel>
      <PanelHeader
        noBorder
        heading="Workspace name"
        subheading="This is the name of your workspace, which will hold your data and other configuration. This would typically be the name of the company you work for or represent."
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-full flex items-stretch gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant={showSaved ? 'success' : 'sunglow'}
              type="submit"
              loading={isSubmitting}
            >
              {isSubmitting ? 'Saving' : showSaved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </form>
      </Form>
    </Panel>
  )
}

export { WorkspaceNameForm }
