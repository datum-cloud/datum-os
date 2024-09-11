'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/dialog'
import { Input } from '@repo/ui/input'
import { Button } from '@repo/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  useForm,
  zodResolver,
} from '@repo/ui/form'
import { ContactFormInput, ContactFormSchema } from '@/utils/schemas'
import { Datum } from '@repo/types'
import { createContacts, editContacts } from '@/query/contacts'

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
  console.log(contact)
  const isNew = !contact || !contact.id
  const {
    form: formStyle,
    fieldsContainer,
    labelContainer,
    requiredText,
  } = formStyles()
  const { data: session } = useSession()
  const organizationId =
    session?.user.organization ?? ('' as Datum.OrganisationId)

  const names = contact?.fullName?.split(' ')
  const [name, ...otherNames] = names || []

  const form = useForm<ContactFormInput>({
    resolver: zodResolver(ContactFormSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      status: 'INACTIVE',
      source: 'form',
      ...contact,
      firstName: name,
      lastName: otherNames.join(' '),
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
  const isValid = Object.keys(errors).length === 0
  const { firstName, lastName } = watch()

  useEffect(() => {
    setValue('fullName', `${firstName || ''} ${lastName || ''}`)
  }, [firstName, lastName])

  async function onSubmit(data: ContactFormInput) {
    if (isNew) {
      await createContacts(organizationId, [data])
    } else {
      await editContacts(organizationId, [data])
    }
    setOpen(false)
    reset()
  }

  function handleCancel() {
    reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isNew ? 'Add a contact' : 'Edit contact info'}
          </DialogTitle>
          <DialogClose onClick={handleCancel} />
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className={formStyle()}>
            <div className={fieldsContainer()}>
              <FormField
                name="email"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <div className={labelContainer()}>
                      <FormLabel>Email</FormLabel>
                      <span className={requiredText()}>Required</span>
                    </div>
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
      </DialogContent>
    </Dialog>
  )
}

export default ContactFormDialog
