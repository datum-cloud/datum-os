'use client'

import { useEffect } from 'react'
import { Button } from '@repo/ui/button'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Logo } from '@repo/ui/logo'
import { useVerifyUser } from '../../../lib/user'

const VerifyUser: React.FC = () => {
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')

  const { isLoading, verified, error } = useVerifyUser(token ?? null)

  useEffect(() => {
    if (verified) {
      const accessToken = verified?.access_token
      const refreshToken = verified?.refresh_token

      signIn('credentials', {
        callbackUrl: '/workspace',
        accessToken,
        refreshToken,
      })
    }
  }, [verified, error])

  return (
    <main className="w-full flex flex-col min-h-screen items-center space-between dark:bg-dk-surface-0 bg-surface-0">
      <div className="flex flex-col gap-6 justify-center items-center mx-auto my-auto w-full p-6 container h-full relative ease-in-out">
        <div className="mx-auto">
          <Logo theme="dark" width={200} />
        </div>
        <div className="flex items-center justify-start flex-col gap-10">
          {isLoading ? (
            <h4 className="text-center text-white">
              Verifying your account...
            </h4>
          ) : (
            <h4 className="text-center text-white">
              Please check your email to verify your account.
            </h4>
          )}
          <Button
            className="w-auto"
            onClick={() => {
              // TODO: Call resend email endpoint
            }}
            type="button"
          >
            Didn&apos;t get the email? Click here to resend.
          </Button>
        </div>
      </div>
    </main>
  )
}

export default VerifyUser
