'use client'

import { Tag } from 'emblor'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/dialog'
import { pluralize } from '@repo/common/text'
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
import { UserInviteInput, UserInviteSchema } from '@/utils/schemas'

import { formStyles } from './page.styles'
import { Loading } from '@/components/shared/loading/loading'
import {
  InviteRole,
  useCreateBulkInviteMutation,
} from '@repo/codegen/src/schema'
import { useGqlError } from '@/hooks/useGqlError'
import { useState } from 'react'
import { toast } from '@repo/ui/use-toast'
import { TagInput } from '@repo/ui/tag-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/select'

type UsersDialogFormProps = {
  open: boolean
  setOpen(input: boolean): void
  inviteAdmins?: boolean
}

const UsersFormDialog = ({
  inviteAdmins = false,
  open,
  setOpen,
}: UsersDialogFormProps) => {
  const [result, inviteMembers] = useCreateBulkInviteMutation()
  const { error, fetching } = result
  const { errorMessages } = useGqlError(error)
  const {
    form: formStyle,
    fieldsContainer,
    labelContainer,
    requiredText,
    selectItem,
  } = formStyles()

  const form = useForm<UserInviteInput>({
    resolver: zodResolver(UserInviteSchema),
    mode: 'onChange',
    defaultValues: {
        emails: [],
      role: InviteRole.MEMBER,
    },
  })

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = form
  const values = watch()

  const isValid = Object.keys(errors).length === 0

  const [emails, setEmails] = useState<Tag[]>([])
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null)
  const [currentValue, setCurrentValue] = useState('')

  async function onSubmit(data: UserInviteInput) {
    try {
      const inviteInput = data.emails.map((email) => ({
        recipient: email,
        role: data.role,
      }))

      await inviteMembers({
        input: inviteInput,
      })
      reset()
      setOpen(false)
      toast({
        title: `${pluralize('Invite', data.emails.length)} sent successfully`,
        variant: 'success',
      })
      setEmails([])
    } catch (error) {
      console.error(error)

      toast({
        title: `${pluralize('Invite', data.emails.length)} could not be sent`,
        variant: 'destructive',
      })
    }
  }

  function isValidEmail(email: string) {
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

  function handleCancel() {
    reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Users</DialogTitle>
          <DialogClose onClick={handleCancel} />
        </DialogHeader>
        {fetching && <Loading className="min-h-96" />}
        {error && <p>Whoops... something went wrong</p>}
        {!fetching && (
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className={formStyle()}>
              <div className={fieldsContainer()}>
                <FormField
                  name="emails"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emails</FormLabel>
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
                      {errors.emails && errors.emails?.[0] && (
                        <FormMessage>{errors.emails[0].message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visibility</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          defaultValue={field.value || ''}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent sideOffset={2}>
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
                                <SelectItem
                                  key={i}
                                  value={value}
                                  className={selectItem()}
                                >
                                  {key[0].toUpperCase() +
                                    key.slice(1).toLowerCase()}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="flex gap-5">
                <DialogClose
                  asChild
                  disabled={!isValid}
                  onClick={handleSubmit(onSubmit)}
                >
                  <Button
                    type="button"
                    disabled={!isValid}
                    full
                    className="w-2/3"
                  >
                    Invite
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  onClick={handleCancel}
                  className="w-1/3 ml-0"
                  variant="outline"
                >
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default UsersFormDialog
