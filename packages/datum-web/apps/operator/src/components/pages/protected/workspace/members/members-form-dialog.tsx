'use client'

import { useEffect } from 'react'

import {
  OrgMembershipRole,
  useUpdateUserRoleInOrgMutation,
} from '@repo/codegen/src/schema'
import { Datum } from '@repo/types'
import { Button } from '@repo/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  useForm,
  zodResolver,
} from '@repo/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/select'
import { useToast } from '@repo/ui/use-toast'

import { Error } from '@/components/shared/error/error'
import { Loading } from '@/components/shared/loading/loading'
import { MemberInput, MemberSchema } from '@/utils/schemas'

import { formStyles } from './page.styles'

type MembersDialogFormProps = {
  member: Datum.OrgUser
  open: boolean
  setOpen(input: boolean): void
}

const MembersFormDialog = ({
  member,
  open,
  setOpen,
}: MembersDialogFormProps) => {
  const { toast } = useToast()
  const { orgRole, membershipId } = member
  const { form: formStyle, fieldsContainer, selectItem } = formStyles()
  const [_, updateUserRoleInOrg] = useUpdateUserRoleInOrgMutation()

  const form = useForm<MemberInput>({
    resolver: zodResolver(MemberSchema),
    mode: 'onChange',
    defaultValues: {
      role: orgRole || '',
    },
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitted },
  } = form
  const isValid = Object.keys(errors).length === 0

  useEffect(() => {
    if (open) {
      reset({
        role: orgRole || '',
      })
    }
  }, [open, member, reset])

  async function onSubmit(data: MemberInput) {
    try {
      const result = await updateUserRoleInOrg({
        updateOrgMemberId: membershipId,
        input: {
          role: data.role as OrgMembershipRole,
        },
      })

      if (result.error) {
        toast({
          title: `Error ${result.error.message}`,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Role updated successfully',
          variant: 'success',
        })
        handleCancel()
      }
    } catch (err) {
      toast({
        title: `Unexpected error: ${(err as Error).message}`,
        variant: 'destructive',
      })
    }
  }

  function handleCancel() {
    setOpen(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit role for {`"${member?.firstName} ${member?.lastName}"`}
          </DialogTitle>
          <DialogClose onClick={handleCancel} />
        </DialogHeader>
        {isSubmitting || isSubmitted ? (
          <Loading className="min-h-96" />
        ) : (
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className={formStyle()}>
              <div className={fieldsContainer()}>
                <FormField
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
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
                            <SelectItem value="MEMBER" className={selectItem()}>
                              Member
                            </SelectItem>
                            <SelectItem value="OWNER" className={selectItem()}>
                              Owner
                            </SelectItem>
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
                    Save
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

export default MembersFormDialog
