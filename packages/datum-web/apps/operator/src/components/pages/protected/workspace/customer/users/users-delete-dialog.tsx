'use client'

import { useRouter } from 'next/navigation'
import { TriangleAlert } from 'lucide-react'

import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { Button } from '@repo/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/dialog'
import { Datum } from '@repo/types'

import { Loading } from '@/components/shared/loading/loading'

import { deleteDialogStyles } from './page.styles'
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
import { DeletionInput, DeletionSchema } from '@/utils/schemas'
import { useDeleteUserMutation } from '@repo/codegen/src/schema'

type UserDeleteFormProps = {
  users: Datum.User[]
  open: boolean
  setOpen(input: boolean): void
  redirect?: boolean
}

const UserDeleteDialog = ({
  users,
  open,
  redirect = false,
  setOpen,
}: UserDeleteFormProps) => {
  const requiredText = 'delete'
  const router = useRouter()
  const [{ fetching }, deleteUser] = useDeleteUserMutation()

  const { content, text, button, cancelButton } = deleteDialogStyles()
  const form = useForm<DeletionInput>({
    mode: 'onSubmit',
    resolver: zodResolver(DeletionSchema),
    defaultValues: {
      deletionText: '',
    },
  })

  const { handleSubmit, watch } = form
  const { deletionText } = watch()

  function handleCancel() {
    setOpen(false)
  }

  async function onSubmit(data: DeletionInput) {
    const ids = users.map(({ id }) => id)
    await Promise.all(ids.map((id) => deleteUser({ deleteUserId: id })))

    if (redirect) {
      router.push(OPERATOR_APP_ROUTES.users)
    }

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">
            Delete{' '}
            {users.length > 1
              ? 'users'
              : users[0]?.firstName
                ? `"${users[0]?.firstName} ${users[0]?.lastName}"`
                : 'this user'}
          </DialogTitle>
          <DialogClose onClick={handleCancel} />
        </DialogHeader>
        {fetching && <Loading className="min-h-96" />}
        {!fetching && (
          <Form {...form}>
            <form className={content()} onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-3">
                <div className={text()}>
                  <TriangleAlert />
                  Deleting a user is irreversible
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
                        {users.length > 1 ? 'these users' : 'the user'}
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
                  Delete
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

export default UserDeleteDialog
