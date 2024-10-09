'use client'

import { Tag } from 'emblor'
import React, { useEffect, useState } from 'react'
import { UseQueryExecute } from 'urql'

import {
  CreateInviteInput,
  InputMaybe,
  InviteRole,
  useCreateBulkInviteMutation,
} from '@repo/codegen/src/schema'
import { pluralize } from '@repo/common/text'
import { Button } from '@repo/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
  zodResolver,
} from '@repo/ui/form'
import { Panel, PanelHeader } from '@repo/ui/panel'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/select'
import { TagInput } from '@repo/ui/tag-input'
import { useToast } from '@repo/ui/use-toast'

import { useGqlError } from '@/hooks/useGqlError'
import { UserInviteInput, UserInviteSchema } from '@/utils/schemas'

import { inviteStyles } from './page.styles'

type InviteFormProps = {
  inviteAdmins: boolean
  refetchInvites: UseQueryExecute
}

const InviteForm = ({ inviteAdmins, refetchInvites }: InviteFormProps) => {
  const { buttonRow, roleRow } = inviteStyles()
  const { toast } = useToast()

  const [result, inviteMembers] = useCreateBulkInviteMutation()
  const { error, fetching } = result
  const { errorMessages } = useGqlError(error)

  const form = useForm<UserInviteInput>({
    resolver: zodResolver(UserInviteSchema),
    defaultValues: {
      emails: [],
      role: InviteRole.MEMBER,
    },
  })

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form

  const values = watch()

  const [emails, setEmails] = useState<Tag[]>([])
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null)
  const [currentValue, setCurrentValue] = useState('')

  async function onSubmit(data: UserInviteInput) {
    const inviteInput: InputMaybe<
      Array<CreateInviteInput> | CreateInviteInput
    > = data.emails.map((email) => ({
      recipient: email,
      role: data.role,
    }))

    const response = await inviteMembers({
      input: inviteInput,
    })

    if (response.error) {
      toast({
        title: 'Error inviting members',
        variant: 'destructive',
      })
    } else {
      toast({
        title: `Invite${emails.length > 1 ? 's' : ''} sent successfully`,
        variant: 'success',
      })
      refetchInvites({
        requestPolicy: 'network-only',
      })
    }
    setEmails([])
  }

  const errorMessage =
    errors.emails && Array.isArray(errors.emails) && errors.emails.length > 0
      ? errors.emails[0]?.message
      : null

  useEffect(() => {
    if (errorMessages.length > 0) {
      toast({
        title: errorMessages.join('\n'),
        variant: 'destructive',
      })
    }
  }, [errorMessages])

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  function handleEmails(newTags: Tag[]) {
    const emailTags = newTags.map((tag) => tag.text)
    setEmails(newTags)
    setValue('emails', emailTags)
    setCurrentValue('')
  }

  function handleBlur() {
    if (isValidEmail(currentValue) && !values.emails.includes(currentValue)) {
      const newTag = { id: currentValue, text: currentValue }
      setEmails((prev) => [...prev, newTag])
      setValue('emails', [...emails.map((tag) => tag.text), currentValue])
    }
    setCurrentValue('')
  }

  return (
    <Panel>
      <PanelHeader
        heading="Invite new members"
        subheading="Enter or paste one or more email addresses, separated by commas."
        noBorder
      />
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            name="emails"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TagInput
                    {...field}
                    tags={emails}
                    setTags={handleEmails}
                    activeTagIndex={activeTagIndex}
                    setActiveTagIndex={setActiveTagIndex}
                    inputProps={{ value: currentValue }}
                    onInputChange={(newValue: string) =>
                      setCurrentValue(newValue)
                    }
                    onBlur={handleBlur}
                  />
                </FormControl>
                {errorMessage && <FormMessage>{errorMessage}</FormMessage>}
              </FormItem>
            )}
          />

          <div className={buttonRow()}>
            <div className={roleRow()}>
              Role:{' '}
              <FormField
                name="role"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-[186px] h-11">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(InviteRole)
                            .reverse()
                            .filter(([key]) => !key.includes('USER'))
                            .filter(([key]) => {
                              if (!inviteAdmins) {
                                return !key.includes('ADMIN')
                              }

                              return true
                            })
                            .map(([key, value], i) => (
                              <SelectItem key={i} value={value}>
                                {key[0].toUpperCase() +
                                  key.slice(1).toLowerCase()}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {errors.role && (
                      <FormMessage>{errors.role.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={emails.length === 0}>
              Send {pluralize('invitation', emails.length)}
            </Button>
          </div>
        </form>
      </Form>
    </Panel>
  )
}

export { InviteForm }
