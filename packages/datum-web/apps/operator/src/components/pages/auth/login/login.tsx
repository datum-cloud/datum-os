'use client'

import { startAuthentication } from '@simplewebauthn/browser'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'

import { DEFAULT_ERROR_MESSAGE, ERROR_MESSAGES } from '@repo/constants'
import { LoginUser } from '@repo/dally/user'
import { Button } from '@repo/ui/button'
import MessageBox from '@repo/ui/message-box'
import SimpleForm from '@repo/ui/simple-form'
import { GoogleIcon } from '@repo/ui/icons/google'
import { Separator } from '@repo/ui/separator'
import { GithubIcon } from '@repo/ui/icons/github'
import { Input } from '@repo/ui/input'
import { PasswordInput } from '@repo/ui/password-input'
import { Label } from '@repo/ui/label'

import { getPasskeySignInOptions, verifyAuthentication } from '@/lib/user'
import { setSessionCookie } from '@/lib/auth/utils/set-session-cookie'

import { loginStyles } from './login.styles'

const TEMP_PASSKEY_EMAIL = 'tempuser@test.com'
const TEMP_PASSKEY_NAME = 'Temp User'

export const LoginPage = () => {
  const { separator, buttons, form, input, oAuthButton } = loginStyles()
  const router = useRouter()
  const [signInError, setSignInError] = useState<string>()
  const [signInLoading, setSignInLoading] = useState(false)
  const showLoginError = !signInLoading && signInError

  /**
   * Submit client-side sign-in function using username and password
   */
  const submit = async (payload: LoginUser) => {
    setSignInLoading(true)
    setSignInError(undefined)
    try {
      const res: any = await signIn('credentials', {
        redirect: false,
        ...payload,
      })
      if (res.ok && !res.error) {
        router.push('/workspace')
      } else {
        setSignInLoading(false)
        const error = ERROR_MESSAGES?.[res.error] || DEFAULT_ERROR_MESSAGE
        setSignInError(error)
      }
    } catch (error: any) {
      setSignInLoading(false)
      const errorMessage =
        error?.message && ERROR_MESSAGES?.[error.message]
          ? ERROR_MESSAGES?.[error.message]
          : DEFAULT_ERROR_MESSAGE
      setSignInError(errorMessage)
    }
  }

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
        setSignInError(`Error: ${verificationResult.error}`)
      }

      return verificationResult
    } catch (error: any) {
      const errorMessage =
        error?.message && ERROR_MESSAGES?.[error.message]
          ? ERROR_MESSAGES?.[error.message]
          : DEFAULT_ERROR_MESSAGE
      setSignInError(errorMessage)
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

      <SimpleForm
        classNames={form()}
        onSubmit={(e: any) => {
          submit(e)
        }}
      >
        <div className={input()}>
          <Label htmlFor="username" className="dark:text-blackberry-800">
            Email
          </Label>
          <Input
            name="username"
            className="dark:text-blackberry-800"
            placeholder="email@domain.net"
          />
        </div>
        <div className={input()}>
          <Label htmlFor="password" className="dark:text-blackberry-800">
            Password
          </Label>
          <PasswordInput
            name="password"
            className="dark:text-blackberry-800"
            placeholder="Password"
          />
        </div>

        <Button
          className="mr-auto !mt-0"
          full
          icon={<ArrowUpRight />}
          iconAnimated
          type="submit"
        >
          Login
        </Button>
      </SimpleForm>
      {showLoginError && (
        <MessageBox className="p-4 ml-1" message={signInError} />
      )}
      <a
        href=""
        target="_blank"
        rel="noopenner noreferrer"
        className="text-center text-body-sm text-sunglow-900 underline mt-4"
      >
        Forgot your password
      </a>
    </div>
  )
}
