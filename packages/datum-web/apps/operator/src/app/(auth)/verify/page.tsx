'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'

import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { Logo } from '@repo/ui/logo'

import { useVerifyUser } from '../../../lib/user'
import { pageStyles as loginStyles } from '../login/page.styles'

const VerifyUser: React.FC = () => {
  const [email, setEmail] = useState<string>()
  const { container, content, logo, bg, bgImage } = loginStyles()
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')

  const { verified, error } = useVerifyUser(token ?? null)

  useEffect(() => {
    if (verified) {
      const accessToken = verified?.access_token
      const refreshToken = verified?.refresh_token

      setEmail(verified?.email)

      signIn('credentials', {
        callbackUrl: OPERATOR_APP_ROUTES.home,
        accessToken,
        refreshToken,
      })
    }
  }, [verified, error])

  return (
    <div className={container()}>
      <div className={content({ wideContent: true })}>
        <div className={logo()}>
          <Logo theme="light" width={120} />
        </div>
        <p className="text-center text-blackberry-800 text-body-l tracking-[-0.18px]">
          We&apos;ve sent a verification email to{' '}
          {email ?? 'the address you provided'}, please click on the link within
          to continue.
        </p>
      </div>
      <div className={bg({ activeBg: true })}>
        <Image
          src="/backgrounds/auth/signup-bg.png"
          priority
          fill
          className={bgImage()}
          alt="Background Image"
        />
      </div>
    </div>
  )
}

export default VerifyUser
