'use client'

import { TriangleAlert } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

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
import { useAsyncFn } from '@/hooks/useAsyncFn'
import { removeVendors } from '@/query/vendors'
import { DeletionInput, DeletionSchema } from '@/utils/schemas'

import { deleteDialogStyles } from './page.styles'

type VendorsDeleteFormProps = {
  vendors: Datum.Vendor[]
  open: boolean
  setOpen(input: boolean): void
}

const VendorsDeleteDialog = ({
  vendors,
  open,
  setOpen,
}: VendorsDeleteFormProps) => {
  const requiredText = 'remove'
  const router = useRouter()
  const [{ loading }, deleteVendors] = useAsyncFn(removeVendors)
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
    const ids = vendors.map(({ id }) => id)
    await deleteVendors(organizationId, ids)

    handleCancel()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">
            Remove {vendors.length > 1 ? 'vendors' : `"${vendors[0]?.name}"`}
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
                  Removing a vendor is irreversible
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
                        {vendors.length > 1 ? 'these vendors' : 'the vendor'}
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

export default VendorsDeleteDialog
