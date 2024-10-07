'use client'

import { TriangleAlert } from 'lucide-react'

import { useRemoveUserFromOrgMutation } from '@repo/codegen/src/schema'
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
  FormMessage,
  useForm,
  zodResolver,
} from '@repo/ui/form'
import { Input } from '@repo/ui/input'

import { Loading } from '@/components/shared/loading/loading'
import { DeletionInput, DeletionSchema } from '@/utils/schemas'

import { deleteDialogStyles } from './page.styles'

type MembersDeleteFormProps = {
  members: Datum.OrgUser[]
  open: boolean
  setOpen(input: boolean): void
  redirect?: boolean
}

const MembersDeleteDialog = ({
  members,
  open,
  redirect = false,
  setOpen,
}: MembersDeleteFormProps) => {
  const requiredText = 'remove'
  const [{ fetching, error }, removeUserFromOrg] =
    useRemoveUserFromOrgMutation()

  const { content, text, button, cancelButton } = deleteDialogStyles()
  const form = useForm<DeletionInput>({
    mode: 'onSubmit',
    resolver: zodResolver(DeletionSchema),
    defaultValues: {
      deletionText: '',
    },
  })

  const {
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitted, isSubmitting },
  } = form
  const { deletionText } = watch()

  function handleCancel() {
    setOpen(false)
    reset()
  }

  async function onSubmit(data: DeletionInput) {
    const ids = members.map(({ id }) => id)
    for (const id of ids) {
      removeUserFromOrg({ deleteOrgMembershipId: id })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">
            Remove{' '}
            {members.length > 1
              ? 'members'
              : `${members[0]?.firstName} ${members[0]?.lastName}`}
          </DialogTitle>
          <DialogClose onClick={handleCancel} />
        </DialogHeader>
        {isSubmitted || isSubmitting ? (
          <Loading className="min-h-96" />
        ) : (
          <Form {...form}>
            <form className={content()} onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-3">
                <div className={text()}>
                  <TriangleAlert />
                  Removing a member is irreversible
                </div>
                <FormField
                  control={form.control}
                  name="deletionText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Please enter the text{' '}
                        <span className="font-bold">{requiredText}</span> to
                        confirm you want to remove{' '}
                        {members.length > 1 ? 'these members' : 'the member'}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="destructive"
                  type="submit"
                  className={button()}
                  disabled={deletionText !== requiredText}
                >
                  Remove
                </Button>
                <Button
                  type="button"
                  onClick={handleCancel}
                  className={cancelButton()}
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

export default MembersDeleteDialog
