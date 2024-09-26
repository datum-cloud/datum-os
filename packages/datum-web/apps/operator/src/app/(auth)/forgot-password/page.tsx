'use client'

import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'

import { capitalizeFirstLetter } from '@repo/common/text'
import { Button } from '@repo/ui/button'
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
import { Logo } from '@repo/ui/logo'
import { DEFAULT_ERROR_MESSAGE, OPERATOR_API_ROUTES } from '@repo/constants'
import { ResetUserInput, ResetUserSchema } from '@/utils/schemas'

import { pageStyles as loginStyles } from '../login/page.styles'
import { pageStyles } from './forgot-password.styles'

const ForgotPassword: React.FC = () => {
  const [error, setError] = useState<string>()
  const form = useForm<ResetUserInput>({
    mode: 'onSubmit',
    resolver: zodResolver(ResetUserSchema),
    defaultValues: { email: '' },
  })
  const {
    handleSubmit,
    control,
    watch,
    formState: { isSubmitSuccessful, isSubmitting },
  } = form
  const formValues = watch()
  const { email } = formValues
  const { formInner } = pageStyles()
  const { container, content, bg, bgImage } = loginStyles()

  async function onSubmit(data: ResetUserInput) {
    try {
      const response: any = await fetch(OPERATOR_API_ROUTES.reset, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok && response?.message) {
        setError(capitalizeFirstLetter(response?.message))
      }
    } catch (error) {
      console.error(error)
      setError(DEFAULT_ERROR_MESSAGE)
    }
  }

  return (
    <div className={container()}>
      <div className={content({ wideContent: true })}>
        <div className="flex items-center justify-center">
          <Logo theme="light" width={120} />
        </div>
        {!isSubmitSuccessful ? (
          <div className="flex flex-col mt-8 justify-start gap-7">
            <p className="text-center text-body-l text-blackberry-800">
              Enter your user account's verified email address and we will send
              you a password reset link.
            </p>
            <Form {...form}>
              <form className={formInner()} onSubmit={handleSubmit(onSubmit)}>
                <FormField
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-blackberry-800">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="dark:text-blackberry-800"
                          placeholder="email@domain.net"
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  className="mr-auto !mt-0"
                  full
                  icon={!isSubmitting ? <ArrowUpRight /> : undefined}
                  iconAnimated
                  type="submit"
                >
                  {isSubmitting ? 'Sending...' : 'Reset Password'}
                </Button>
              </form>
              {error && <FormMessage className="mt-1">{error}</FormMessage>}
            </Form>
          </div>
        ) : (
          <div className="flex flex-col mt-8 justify-start gap-7">
            <p className="text-center text-body-l text-blackberry-800">
              Please check the email address {email} for instructions to reset
              your password
            </p>
            <Button
              icon={!isSubmitting ? <ArrowUpRight /> : undefined}
              iconAnimated
              onClick={handleSubmit(onSubmit)}
            >
              {isSubmitting ? 'Sending...' : 'Resend email'}
            </Button>
          </div>
        )}
      </div>
      <div className={bg({ activeBg: true })}>
        <Image
          src="/backgrounds/auth/login-bg.png"
          priority
          fill
          className={bgImage()}
          alt="Background Image"
        />
      </div>
    </div>
  )
}

export default ForgotPassword
