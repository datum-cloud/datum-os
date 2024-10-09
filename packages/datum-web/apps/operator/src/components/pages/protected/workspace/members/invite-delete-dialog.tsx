'use client'

import { TriangleAlert } from 'lucide-react'

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

type InviteDeleteFormProps = {
  invites: Datum.Invitation[]
  open: boolean
  setOpen(input: boolean): void
  handleDelete(invites: Datum.Invitation[]): Promise<void>
}

const InviteDeleteDialog = ({
  invites,
  open,
  setOpen,
  handleDelete,
}: InviteDeleteFormProps) => {
  const requiredText = 'delete'

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
    await handleDelete(invites)
    handleCancel()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">
            Delete{' '}
            {invites.length > 1
              ? 'invites'
              : `invite for "${invites[0]?.recipient}"`}
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
                  Deleting an invite is irreversible
                </div>
                <FormField
                  control={form.control}
                  name="deletionText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Please enter the text{' '}
                        <span className="font-bold">{requiredText}</span> to
                        confirm you want to delete{' '}
                        {invites.length > 1 ? 'these invites' : 'the invite'}
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
                  delete
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

export default InviteDeleteDialog
