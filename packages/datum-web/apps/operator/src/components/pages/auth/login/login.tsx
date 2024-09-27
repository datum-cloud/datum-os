'use client'

import { startAuthentication } from '@simplewebauthn/browser'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { ArrowUpRight } from 'lucide-react'
import { useEffect, useState } from 'react'

import {
  DEFAULT_ERROR_MESSAGE,
  ERROR_MESSAGES,
  OPERATOR_APP_ROUTES,
} from '@repo/constants'
import { Button } from '@repo/ui/button'
import { GoogleIcon } from '@repo/ui/icons/google'
import { Separator } from '@repo/ui/separator'
import { GithubIcon } from '@repo/ui/icons/github'
import { Input } from '@repo/ui/input'
import { PasswordInput } from '@repo/ui/password-input'
import { Label } from '@repo/ui/label'

import { getPasskeySignInOptions, verifyAuthentication } from '@/lib/user'
import { setSessionCookie } from '@/lib/auth/utils/set-session-cookie'

import { loginStyles } from './login.styles'
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
import { RegisterUserInput, RegisterUserSchema } from '@/utils/schemas'
import Link from 'next/link'

const TEMP_PASSKEY_EMAIL = 'tempuser@test.com'
const TEMP_PASSKEY_NAME = 'Temp User'

export const LoginPage = () => {
  const router = useRouter()
  const form = useForm<RegisterUserInput>({
    mode: 'onSubmit',
    resolver: zodResolver(RegisterUserSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = form
  const [error, setError] = useState<string>()
  const { separator, buttons, formInner, input, oAuthButton } = loginStyles()

  const { email, password } = watch()

  async function onSubmit(payload: RegisterUserInput) {
    try {
      const res: any = await signIn('credentials', {
        redirect: false,
        username: payload.email,
        ...payload,
      })
      if (res.ok && !res.error) {
        router.push(OPERATOR_APP_ROUTES.home)
      } else {
        const error = ERROR_MESSAGES?.[res.error] || DEFAULT_ERROR_MESSAGE
        setError(error)
      }
    } catch (error: any) {
      const errorMessage =
        error?.message && ERROR_MESSAGES?.[error.message]
          ? ERROR_MESSAGES?.[error.message]
          : DEFAULT_ERROR_MESSAGE
      setError(errorMessage)
    }
  }

  async function handleGithubOAuth() {
    await signIn('github', {
      callbackUrl: OPERATOR_APP_ROUTES.home,
    })
  }

  async function handleGoogleOAuth() {
    await signIn('google', {
      callbackUrl: OPERATOR_APP_ROUTES.home,
    })
  }

  async function passKeySignIn() {
    try {
      const options = await getPasskeySignInOptions({
        email: TEMP_PASSKEY_EMAIL,
      })
      setSessionCookie(options.session)

      const assertionResponse = await startAuthentication(options.publicKey)
      const verificationResult = await verifyAuthentication({
        assertionResponse,
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
        setError(`Error: ${verificationResult.error}`)
      }

      return verificationResult
    } catch (error: any) {
      const errorMessage =
        error?.message && ERROR_MESSAGES?.[error.message]
          ? ERROR_MESSAGES?.[error.message]
          : DEFAULT_ERROR_MESSAGE
      setError(errorMessage)
    }
  }

  useEffect(() => {
    if (error) {
      setError(undefined)
    }
  }, [email, password])

  return (
    <div className="flex flex-col mt-8 justify-start">
      <div className={buttons()}>
        <button
          type="button"
          className={oAuthButton()}
          onClick={handleGoogleOAuth}
        >
          <GoogleIcon />
          Log in with Google
        </button>

        <button
          type="button"
          className={oAuthButton()}
          onClick={handleGithubOAuth}
        >
          <GithubIcon />
          Log in with GitHub
        </button>

        {/* NOTE: Temporarily removing */}
        {/* <Button
            variant="outline"
            size="md"
            icon={<KeyRoundIcon className={keyIcon()} />}
            iconPosition="left"
            onClick={() => {
              passKeySignIn()
            }}
          >
            Log in with PassKey
          </Button> */}
      </div>

      <Separator label="or" className={separator()} />

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
          <div className={input()}>
            <Label htmlFor="password" className="dark:text-blackberry-800">
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
            disabled={isSubmitting}
            icon={!isSubmitting ? <ArrowUpRight /> : undefined}
            iconAnimated
            type="submit"
          >
            <div className="flex items-center gap-2">
              {isSubmitting ? 'Loading...' : 'Login'}
            </div>
          </Button>
        </form>
        {error && <FormMessage className="mt-1">{error}</FormMessage>}
      </Form>
      <Link
        href={OPERATOR_APP_ROUTES.forgotPassword}
        className="text-center text-body-sm text-sunglow-900 underline mt-4"
      >
        Forgot your password
      </Link>
    </div>
  )
}
