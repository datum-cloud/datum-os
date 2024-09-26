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
  FormMessage,
  useForm,
  zodResolver,
} from '@repo/ui/form'
import { RegisterUserInput, RegisterUserSchema } from '@/utils/schemas'
import Link from 'next/link'
import { DEFAULT_ERROR_MESSAGE, OPERATOR_APP_ROUTES } from '@repo/constants'
import { capitalizeFirstLetter } from '@repo/common/text'

const TEMP_PASSKEY_EMAIL = 'tempuser@test.com'
const TEMP_PASSKEY_NAME = 'Temp User'

export const SignupPage = () => {
  const form = useForm<RegisterUserInput>({
    mode: 'onSubmit',
    resolver: zodResolver(RegisterUserSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const {
    handleSubmit,
    control,
    register,
    formState: { isSubmitting, errors },
  } = form
  const router = useRouter()
  const [error, setError] = useState<string>()
  const { separator, buttons, keyIcon, formInner, input, oAuthButton } =
    signupStyles()

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
          callbackUrl: OPERATOR_APP_ROUTES.home,
          email: TEMP_PASSKEY_EMAIL,
          name: TEMP_PASSKEY_NAME,
          session: verificationResult.session,
          accessToken: verificationResult.access_token,
          refreshToken: verificationResult.refresh_token,
        })
      }

      if (!verificationResult.success) {
        setError(DEFAULT_ERROR_MESSAGE)
      }

      return verificationResult
    } catch (error) {
      setError(DEFAULT_ERROR_MESSAGE)
    }
  }

  async function onSubmit(data: RegisterUserInput) {
    try {
      const res: any = await registerUser(data)
      if (res?.ok) {
        router.push('/verify')
      } else if (res?.message) {
        setError(capitalizeFirstLetter(res.message))
      } else {
        setError(DEFAULT_ERROR_MESSAGE)
      }
    } catch (error) {
      setError(DEFAULT_ERROR_MESSAGE)
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
              placeholder="password"
            />
            {errors?.password && (
              <FormMessage>{errors.password.message}</FormMessage>
            )}
          </div>
          <Button
            className="mr-auto w-full"
            icon={<ArrowUpRight />}
            size="md"
            type="submit"
            iconAnimated
          >
            {isSubmitting ? 'loading' : 'Sign up'}
          </Button>
        </form>
        {error && <FormMessage className="mt-1">{error}</FormMessage>}
      </Form>
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
