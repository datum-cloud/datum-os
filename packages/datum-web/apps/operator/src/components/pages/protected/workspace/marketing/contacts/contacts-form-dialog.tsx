'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'

import { getPathWithParams } from '@repo/common/routes'
import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { Datum } from '@repo/types'
import { Button } from '@repo/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { Input } from '@repo/ui/input'

import { Error } from '@/components/shared/error/error'
import { Loading } from '@/components/shared/loading/loading'
import { useAsyncFn } from '@/hooks/useAsyncFn'
import { createContacts, editContacts } from '@/query/contacts'
import { ContactFormInput, ContactFormSchema } from '@/utils/schemas'

import { formStyles } from './page.styles'

type ContactDialogFormProps = {
  open: boolean
  setOpen(input: boolean): void
  contact?: Datum.Contact
}

const ContactFormDialog = ({
  contact,
  open,
  setOpen,
}: ContactDialogFormProps) => {
  const router = useRouter()
  const isNew = !contact || !contact.id
  const {
    form: formStyle,
    fieldsContainer,
    labelContainer,
    requiredText,
  } = formStyles()
  const [{ error: errorCreate }, create] = useAsyncFn(createContacts)
  const [{ error: errorEdit }, edit] = useAsyncFn(editContacts)
  const { data: session } = useSession()
  const organizationId =
    session?.user.organization ?? ('' as Datum.OrganisationId)

  const error = errorEdit || errorCreate
  const names = contact?.fullName?.split(' ')
  const [name, ...otherNames] = names || []
  const defaultValues = useMemo(() => {
    return {
      email: '',
      status: 'ACTIVE',
      source: 'form',
      ...contact,
      firstName: name,
      lastName: otherNames.join(' '),
    }
  }, [contact])

  const form = useForm<ContactFormInput>({
    resolver: zodResolver(ContactFormSchema),
    mode: 'onChange',
    values: defaultValues,
  })

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitted, isSubmitting },
  } = form
  const isValid = Object.keys(errors).length === 0
  const { firstName, lastName } = watch()

  useEffect(() => {
    setValue('fullName', `${firstName || ''} ${lastName || ''}`)
  }, [firstName, lastName])

  async function onSubmit(data: ContactFormInput) {
    let id: string | undefined

    if (isNew) {
      const contacts = await create(organizationId, [data])
      id = contacts[0].id
      await router.push(getPathWithParams(OPERATOR_APP_ROUTES.contact, { id }))

      // NOTE: This is needed to navigate pages without removing pointer events per https://github.com/shadcn-ui/ui/issues/468
      setTimeout(() => (document.body.style.pointerEvents = ''), 500)
    } else {
      const contacts = await edit(organizationId, [data])
      id = contacts[0].id
      handleCancel()
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
            {isNew ? 'Add a contact' : 'Edit contact info'}
          </DialogTitle>
          <DialogDescription />
          <DialogClose onClick={handleCancel} />
        </DialogHeader>
        {isSubmitting || isSubmitted ? (
          <Loading className="min-h-96" />
        ) : error ? (
          <Error />
        ) : (
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className={formStyle()}>
              <div className={fieldsContainer()}>
                <FormField
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelContainer()}>
                        Email
                        <span className={requiredText()}>Required</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
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
                    {isNew ? 'Add contact' : 'Save'}
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

export default ContactFormDialog
