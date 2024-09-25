'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageBox } from '@repo/ui/message-box'
import { Button } from '@repo/ui/button'
import { ArrowUpRight, KeyRoundIcon } from 'lucide-react'
import {
  getPasskeyRegOptions,
  registerUser,
  verifyRegistration,
  type RegisterUser,
} from '@/lib/user'
import { GoogleIcon } from '@repo/ui/icons/google'
import { GithubIcon } from '@repo/ui/icons/github'
import { signIn } from 'next-auth/react'
import { signupStyles } from './signup.styles'
import { Separator } from '@repo/ui/separator'
import { Input } from '@repo/ui/input'
import { PasswordInput } from '@repo/ui/password-input'
import { Label } from '@repo/ui/label'
import { setSessionCookie } from '@/lib/auth/utils/set-session-cookie'
import { startRegistration } from '@simplewebauthn/browser'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  useForm,
  zodResolver,
} from '@repo/ui/form'
import { RegisterUserInput, RegisterUserSchema } from '@/utils/schemas'
import Link from 'next/link'

const TEMP_PASSKEY_EMAIL = 'tempuser@test.com'
const TEMP_PASSKEY_NAME = 'Temp User'

export const SignupPage = () => {
  const form = useForm<RegisterUserInput>({
    mode: 'onSubmit',
    resolver: zodResolver(RegisterUserSchema),
  })
  const {
    handleSubmit,
    control,
    register,
    formState: { isSubmitting },
  } = form
  const router = useRouter()
  const [error, setError] = useState<string>()
  const { separator, buttons, keyIcon, formInner, input, oAuthButton } =
    signupStyles()

  async function handleGithubOAuth() {
    await signIn('github', {
      callbackUrl: '/workspace',
    })
  }

  async function handleGoogleOAuth() {
    await signIn('google', {
      callbackUrl: '/workspace',
    })
  }

  /**
   * Setup PassKey Registration
   */
  async function registerPassKey() {
    try {
      const options = await getPasskeyRegOptions({
        email: TEMP_PASSKEY_EMAIL,
        name: TEMP_PASSKEY_NAME,
      })
      setSessionCookie(options.session)
      const attestationResponse = await startRegistration(options.publicKey)
      const verificationResult = await verifyRegistration({
        attestationResponse,
      })

      if (verificationResult.success) {
        await signIn('passkey', {
          callbackUrl: '/workspace',
          email: TEMP_PASSKEY_EMAIL,
          name: TEMP_PASSKEY_NAME,
          session: verificationResult.session,
          accessToken: verificationResult.access_token,
          refreshToken: verificationResult.refresh_token,
        })
      }

      if (!verificationResult.success) {
        setError('Something went wrong. Please try again.')
      }

      return verificationResult
    } catch (error) {
      setError('Something went wrong. Please try again.')
    }
  }

  async function onSubmit(payload: RegisterUser) {
    try {
      if (payload.password === payload.confirmedPassword) {
        delete payload.confirmedPassword

        const res: any = await registerUser(payload)
        if (res?.ok) {
          router.push('/verify')
        } else if (res?.message) {
          setError('Something went wrong. Please try again.')
        } else {
          setError('Something went wrong. Please try again.')
        }
      } else {
        setError('Passwords do not match')
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="flex flex-col mt-8 justify-start">
      <div className={buttons()}>
        <button
          type="button"
          className={oAuthButton()}
          onClick={handleGoogleOAuth}
        >
          <GoogleIcon />
          Sign up with Google
        </button>

        <button
          type="button"
          className={oAuthButton()}
          onClick={handleGithubOAuth}
        >
          <GithubIcon />
          Sign up with GitHub
        </button>

        {/* NOTE: Temporarily removing */}
        {/* <Button
          variant="outline"
          size="md"
          icon={<KeyRoundIcon className={keyIcon()} />}
          iconPosition="left"
          onClick={registerPassKey}
        >
          Sign up with PassKey
        </Button> */}
      </div>

      <Separator label="or" className={separator()} />

      <Form {...form}>
        <form className={formInner()} onSubmit={handleSubmit(onSubmit)}>
          <FormField
            name="username"
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
              </FormItem>
            )}
          />

          <div className={input()}>
            <Label htmlFor="password" className="dark:text-blackberry-800">
              Password
            </Label>
            <PasswordInput
              {...register('password')}
              className="dark:text-blackberry-800"
              placeholder="password"
            />
          </div>
          <PasswordInput
            {...register('confirmedPassword')}
            className="dark:text-blackberry-800 !mt-0"
            placeholder="Confirm password"
          />
          <Button
            className="mr-auto mt-2 w-full"
            icon={<ArrowUpRight />}
            size="md"
            type="submit"
            iconAnimated
          >
            {isSubmitting ? 'loading' : 'Sign up'}
          </Button>
        </form>
      </Form>
      {error && <MessageBox className="p-4" message={error} />}
      <p className="text-center text-blackberry-600 dark:text-blackberry-600 text-body-xs leading-[130%] mt-7">
        By continuing, you agree to Datum's 
        <Link href="" className="underline">
          Terms of Service
        </Link>
         and 
        <Link href="" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  )
}
