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

type WorkspaceDeleteFormProps = {
  name: string
  open: boolean
  setOpen(input: boolean): void
  handleDelete(): Promise<void>
}

const WorkspaceDeleteDialog = ({
  name,
  open,
  setOpen,
  handleDelete,
}: WorkspaceDeleteFormProps) => {
  const router = useRouter()
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
    await handleDelete()

    await router.push(OPERATOR_APP_ROUTES.workspace)
    handleCancel()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">
            Delete {name ? `"${name}"` : 'this workspace'}
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
                  Deleting a workspace is irreversible
                </div>
                <FormField
                  control={form.control}
                  name="deletionText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Please enter the text{' '}
                        <span className="font-bold">{requiredText}</span> to
                        confirm you want to remove this workspace
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

export default WorkspaceDeleteDialog
