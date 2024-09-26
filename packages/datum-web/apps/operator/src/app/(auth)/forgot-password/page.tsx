'use client'

import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@repo/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from '@repo/ui/form'
import { Input } from '@repo/ui/input'
import { Logo } from '@repo/ui/logo'
import { OPERATOR_APP_ROUTES } from '@repo/constants'

import { pageStyles as loginStyles } from '../login/page.styles'
import { pageStyles } from './forgot-password.styles'

const ForgotPassword: React.FC = () => {
  const [error, setError] = useState<string>()
  const form = useForm({})
  const { handleSubmit, control } = form
  const { formInner } = pageStyles()
  const { container, content, logo, bg, bgImage } = loginStyles()

  async function onSubmit() {
    // TODO: Implement forgot password
  }

  return (
    <div className={container()}>
      <div className={content()}>
        <div className={logo()}>
          <Logo theme="light" width={120} />
        </div>
        <div className="flex flex-col mt-8 justify-start">
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
                icon={<ArrowUpRight />}
                iconAnimated
                type="submit"
              >
                Reset Password
              </Button>
            </form>
            {error && <FormMessage className="mt-1">{error}</FormMessage>}
          </Form>
        </div>
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
