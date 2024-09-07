'use client'

import { zodResolver } from '@hookform/resolvers/zod'

import {
  DialogClose,
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
import { useForm } from 'react-hook-form'
import { ContactCreationInput, ContactCreationSchema } from '@/utils/schemas'
import { useSession } from 'next-auth/react'
import { Datum } from '@repo/types'

interface ContactCreationForm extends ContactCreationInput {
  firstName: string
  lastName: string
}

const AddContactDialog = () => {
  const { data: session } = useSession()
  const organizationId =
    session?.user.organization ?? ('' as Datum.OrganisationId)

  const form = useForm<ContactCreationForm>({
    resolver: zodResolver(ContactCreationSchema),
    mode: 'onChange',
  })

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid },
  } = form
  const { firstName, lastName } = watch()
  console.log(firstName, lastName)

  async function onSubmit(data: ContactCreationForm) {
    console.log(data)
    const fullName = `${data?.firstName?.trim() || ''} ${data?.lastName?.trim() || ''}`
    const contact = { ...data, fullName, status: 'INACTIVE' }
    console.log('CONTACT:', contact)

    // await createContacts(organizationId, [contact])
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Add a contact</DialogTitle>
          </DialogHeader>
          <div className="w-full flex flex-col justify-start gap-2.5">
            <FormField
              name="email"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <div className="w-full flex items-center justify-between">
                    <FormLabel>Email</FormLabel>
                    <span className="type-smallcaps-s text-blackberry-500">
                      Required
                    </span>
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
            <DialogClose asChild>
              <Button disabled={undefined} full className="w-2/3" type="submit">
                Add contact
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="button" className="w-1/3 ml-0" variant="outline">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </form>
    </Form>
  )
}

export default AddContactDialog
