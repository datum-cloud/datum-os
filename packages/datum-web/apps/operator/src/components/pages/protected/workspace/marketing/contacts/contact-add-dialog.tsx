'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

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
} from '@repo/ui/form'
import {
  ContactCreationFormInput,
  ContactCreationFormSchema,
} from '@/utils/schemas'
import { Datum } from '@repo/types'
import { createContacts } from '@/query/contacts'

import { formStyles } from './form.styles'

type AddContactDialogProps = {
  open: boolean
  setOpen(input: boolean): void
}

const AddContactDialog = ({ open, setOpen }: AddContactDialogProps) => {
  const {
    form: formStyle,
    fieldsContainer,
    labelContainer,
    requiredText,
  } = formStyles()
  const { data: session } = useSession()
  const organizationId =
    session?.user.organization ?? ('' as Datum.OrganisationId)

  const form = useForm<ContactCreationFormInput>({
    resolver: zodResolver(ContactCreationFormSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      status: 'INACTIVE',
      source: 'form',
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

  async function onSubmit(data: ContactCreationFormInput) {
    await createContacts(organizationId, [data])
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
          <DialogTitle>Add a contact</DialogTitle>
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
                  Add contact
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

export default AddContactDialog
