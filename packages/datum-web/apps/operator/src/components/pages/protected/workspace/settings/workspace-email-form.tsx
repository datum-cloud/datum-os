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
import { WorkspaceEmailInput, WorkspaceEmailSchema } from '@/utils/schemas'

type BillingEmailInput = { updateOrgSettings: { billingEmail: string } }

type WorkspaceEmailFormProps = {
  email: string
  setEmail(input: BillingEmailInput): Promise<void>
}

const WorkspaceEmailForm = ({ email, setEmail }: WorkspaceEmailFormProps) => {
  const [showSaved, setShowSaved] = useState(false)
  const form = useForm<WorkspaceEmailInput>({
    resolver: zodResolver(WorkspaceEmailSchema),
    defaultValues: {
      email,
    },
  })

  const {
    formState: { isSubmitting },
  } = form

  async function onSubmit(data: WorkspaceEmailInput) {
    await setEmail({
      updateOrgSettings: {
        billingEmail: data.email,
      },
    })

    setShowSaved(true)
  }

  useEffect(() => {
    form.setValue('email', email)
  }, [email])

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
      <PanelHeader heading="Billing email" noBorder />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-full flex items-stretch gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input type="email" {...field} />
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

export { WorkspaceEmailForm }
