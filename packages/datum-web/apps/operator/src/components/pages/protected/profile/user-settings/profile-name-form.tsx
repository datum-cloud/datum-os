'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'

import {
  GetUserProfileQueryVariables,
  useGetUserProfileQuery,
  useUpdateUserInfoMutation,
} from '@repo/codegen/src/schema'
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

import { RESET_SUCCESS_STATE_MS } from '@/constants'
import { UserNameInput, UserNameSchema } from '@/utils/schemas'

import { profileFormStyles } from './profile-name-form.styles'

const ProfileNameForm = () => {
  const { formInner, formFieldsContainer, formInput } = profileFormStyles()
  const [isSuccess, setIsSuccess] = useState(false)
  const [{ fetching: isSubmitting }, updateUserInfo] =
    useUpdateUserInfoMutation()
  const { data: sessionData, update } = useSession()
  const userId = sessionData?.user.userId

  const variables: GetUserProfileQueryVariables = {
    userId: userId ?? '',
  }

  const [{ data: userData }] = useGetUserProfileQuery({
    variables,
    pause: !sessionData,
  })

  const form = useForm<UserNameInput>({
    resolver: zodResolver(UserNameSchema),
    defaultValues: {
      firstName: userData?.user.firstName || '',
      lastName: userData?.user.lastName || '',
    },
  })

  useEffect(() => {
    if (userData) {
      form.reset({
        firstName: userData.user.firstName ?? '',
        lastName: userData.user.lastName ?? '',
      })
    }
  }, [userData, form])

  const updateName = async ({ firstName, lastName }: UserNameInput) => {
    await updateUserInfo({
      updateUserId: userId,
      input: {
        firstName: firstName,
        lastName: lastName,
      },
    })
    setIsSuccess(true)
  }

  const onSubmit = (data: UserNameInput) => {
    updateName({ firstName: data.firstName, lastName: data.lastName })
    update({
      ...sessionData,
      user: {
        ...sessionData?.user,
        name: `${data.firstName} ${data.lastName}`,
      },
    })
  }

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false)
      }, RESET_SUCCESS_STATE_MS)
      return () => clearTimeout(timer)
    }
  }, [isSuccess])

  return (
    <Panel>
      <PanelHeader heading="Your name" noBorder />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={formInner()}>
          <div className={formFieldsContainer()}>
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input
                      className={formInput()}
                      variant="medium"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input
                      className={formInput()}
                      variant="medium"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            variant={isSuccess ? 'success' : 'sunglow'}
            type="submit"
            size="md"
            className="h-12"
            loading={isSubmitting}
          >
            {isSubmitting ? 'Saving' : isSuccess ? 'Saved' : 'Save'}
          </Button>
        </form>
      </Form>
    </Panel>
  )
}

export { ProfileNameForm }
