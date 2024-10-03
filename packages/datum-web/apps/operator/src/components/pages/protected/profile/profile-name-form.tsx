'use client'

import { useForm } from 'react-hook-form'

import { Input } from '@repo/ui/input'
import { Panel, PanelHeader } from '@repo/ui/panel'
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
  FormLabel,
  zodResolver,
} from '@repo/ui/form'
import { Button } from '@repo/ui/button'

import { UserNameInput, UserNameSchema } from '@/utils/schemas'

import { profileFormStyles } from './page.styles'
import { useEffect, useState } from 'react'
import { RESET_SUCCESS_STATE_MS } from '@/constants'

type ProfileNameInput = {
  firstName: string
  lastName: string
}

type ProfileNameFormProps = {
  firstName: string
  lastName: string
  updateData(input: ProfileNameInput): Promise<void>
}

const ProfileNameForm = ({
  firstName,
  lastName,
  updateData,
}: ProfileNameFormProps) => {
  const [showSaved, setShowSaved] = useState(false)
  const { formInner, formFieldsContainer, formInput } = profileFormStyles()

  const form = useForm<UserNameInput>({
    resolver: zodResolver(UserNameSchema),
    defaultValues: {
      firstName,
      lastName,
    },
  })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form

  async function onSubmit(data: UserNameInput) {
    await updateData({
      firstName: data.firstName,
      lastName: data.lastName,
    })

    setShowSaved(true)
  }

  useEffect(() => {
    form.setValue('firstName', firstName)
    form.setValue('lastName', lastName)
  }, [firstName, lastName])

  useEffect(() => {
    if (showSaved) {
      const timer = setTimeout(() => {
        setShowSaved(false)
      }, RESET_SUCCESS_STATE_MS)
      return () => clearTimeout(timer)
    }
  }, [showSaved])

  return (
    <Panel>
      <PanelHeader heading="Name" noBorder />
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className={formInner()}>
          <div className={formFieldsContainer()}>
            <FormField
              control={control}
              name="firstName"
              render={({ field }) => (
                <FormItem className={formInput()}>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="lastName"
              render={({ field }) => (
                <FormItem className={formInput()}>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            variant={showSaved ? 'success' : 'sunglow'}
            type="submit"
            size="md"
            loading={isSubmitting}
          >
            {isSubmitting ? 'Saving' : showSaved ? 'Saved' : 'Save'}
          </Button>
        </form>
      </Form>
    </Panel>
  )
}

export { ProfileNameForm }
