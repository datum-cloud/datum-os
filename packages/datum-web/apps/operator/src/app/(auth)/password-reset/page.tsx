'use client'

import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'

import { capitalizeFirstLetter } from '@repo/common/text'
import { Button } from '@repo/ui/button'
import { Form, FormMessage, useForm, zodResolver } from '@repo/ui/form'
import { Label } from '@repo/ui/label'
import { Logo } from '@repo/ui/logo'
import { PasswordInput } from '@repo/ui/password-input'
import {
  DEFAULT_ERROR_MESSAGE,
  OPERATOR_API_ROUTES,
  OPERATOR_APP_ROUTES,
} from '@repo/constants'
import { ResetPasswordInput, ResetPasswordSchema } from '@/utils/schemas'

import { pageStyles as loginStyles } from '../login/page.styles'
import { pageStyles } from './password-reset.styles'

const ResetPassword: React.FC = () => {
  const { push } = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams?.get('token') || ''

  if (!token || token === '') {
    push(OPERATOR_APP_ROUTES.home)
  }

  const [error, setError] = useState<string>()
  const form = useForm<ResetPasswordInput>({
    mode: 'onSubmit',
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { token, password: '' },
  })
  const {
    handleSubmit,
    register,
    formState: { isSubmitSuccessful, isSubmitting, errors },
  } = form
  const { formInner, input } = pageStyles()
  const { container, content, bg, bgImage } = loginStyles()

  async function onSubmit(data: ResetPasswordInput) {
    try {
      const response: any = await fetch(OPERATOR_API_ROUTES.resetPassword, {
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
      <div className={content()}>
        <div className="flex items-center justify-center">
          <Logo theme="light" width={120} />
        </div>
        {!isSubmitSuccessful ? (
          <div className="flex flex-col mt-8 justify-start gap-7">
            <p className="text-center text-body- text-blackberry-800">
              Enter your new password below
            </p>
            <Form {...form}>
              <form className={formInner()} onSubmit={handleSubmit(onSubmit)}>
                <div className={input()}>
                  <Label
                    htmlFor="password"
                    className="dark:text-blackberry-800"
                  >
                    Password
                  </Label>
                  <PasswordInput
                    {...register('password')}
                    className="dark:text-blackberry-800"
                    placeholder="Password"
                  />
                  {errors?.password && (
                    <FormMessage>{errors?.password?.message}</FormMessage>
                  )}
                </div>

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
              Your password has been updated
            </p>
            <Button
              icon={<ArrowUpRight />}
              iconAnimated
              onClick={() => push(OPERATOR_APP_ROUTES.login)}
            >
              Login
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

export default ResetPassword
