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
import { removeContacts } from '@/query/contacts'

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

type ContactDeleteFormProps = {
  contacts: Datum.Contact[]
  open: boolean
  setOpen(input: boolean): void
  redirect?: boolean
}

const ContactDeleteDialog = ({
  contacts,
  open,
  redirect = false,
  setOpen,
}: ContactDeleteFormProps) => {
  const requiredText = 'delete'
  const router = useRouter()
  const [{ loading }, deleteContacts] = useAsyncFn(removeContacts)
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

  const { handleSubmit, watch } = form
  const { deletionText } = watch()

  function handleCancel() {
    setOpen(false)
  }

  async function onSubmit(data: DeletionInput) {
    const ids = contacts.map(({ id }) => id)
    await deleteContacts(organizationId, ids)

    if (redirect) {
      router.push(OPERATOR_APP_ROUTES.contacts)
    }

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">
            Delete{' '}
            {contacts.length > 1
              ? 'contacts'
              : `${`"${contacts[0]?.fullName}"` ?? 'this contact'}`}
          </DialogTitle>
          <DialogClose onClick={handleCancel} />
        </DialogHeader>
        {loading && <Loading className="min-h-96" />}
        {!loading && (
          <Form {...form}>
            <form className={content()} onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-3">
                <div className={text()}>
                  <TriangleAlert />
                  Deleting a contact is irreversible
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
                        {contacts.length > 1 ? 'these contacts' : 'the contact'}
                      </FormLabel>
                      <FormControl>
                        <Input variant="medium" {...field} className="w-full" />
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

export default ContactDeleteDialog
