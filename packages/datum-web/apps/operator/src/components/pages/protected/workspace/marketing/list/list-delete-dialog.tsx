'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
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
import { useAsyncFn } from '@/hooks/useAsyncFn'
import { removeLists } from '@/query/lists'

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
import { useEffect } from 'react'

type ListDeleteFormProps = {
  lists: Datum.List[]
  open: boolean
  setOpen(input: boolean): void
  redirect?: boolean
}

const ListDeleteDialog = ({
  lists,
  open,
  redirect = false,
  setOpen,
}: ListDeleteFormProps) => {
  const requiredText = 'delete'
  const router = useRouter()
  const [{ loading }, deleteLists] = useAsyncFn(removeLists)
  const { data: session } = useSession()
  const organizationId =
    session?.user.organization ?? ('' as Datum.OrganisationId)

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
    const ids = lists.map(({ id }) => id)
    await deleteLists(organizationId, ids)

    if (redirect) {
      await router.push(OPERATOR_APP_ROUTES.contactLists)
      handleCancel()
    } else {
      handleCancel()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">
            Delete{' '}
            {lists.length > 1
              ? 'lists'
              : lists[0]?.name
                ? `"${lists[0]?.name}"`
                : 'this list'}
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
                  Deleting a list is irreversible
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
                        {lists.length > 1 ? 'these lists' : 'the list'}
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

export default ListDeleteDialog
