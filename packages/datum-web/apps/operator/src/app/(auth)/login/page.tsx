'use client'

import { Logo } from '@repo/ui/logo'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs'
import Image from 'next/image'
import { useState } from 'react'
import { pageStyles } from './page.styles'
import { LoginPage } from '@/components/pages/auth/login/login'
import { SignupPage } from '@/components/pages/auth/signup/signup'

const AuthLogin: React.FC = () => {
  const defaultTab = 'login'
  const { bg, bgImage, content, container, logo } = pageStyles()
  const [activeTab, setActiveTab] = useState(defaultTab)
  return (
    <div className={container()}>
      <div className={content()}>
        <div className={logo()}>
          <Logo theme="light" width={120} />
        </div>
        <Tabs
          variant="underline"
          defaultValue={defaultTab}
          onValueChange={(value) => {
            setActiveTab(value)
          }}
        >
          <TabsList>
            <TabsTrigger value="login" asChild>
              <div className="type-smallcaps-m !tracking-[0.56px] !leading-[150%] flex items-center justify-center cursor-pointer">
                Login
              </div>
            </TabsTrigger>
            <TabsTrigger value="signup" asChild>
              <div className="type-smallcaps-m !tracking-[0.56px] !leading-[150%] flex items-center justify-center cursor-pointer">
                Signup
              </div>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-0">
            <LoginPage />
          </TabsContent>
          <TabsContent value="signup">
            <SignupPage />
          </TabsContent>
        </Tabs>
      </div>
      <div className={bg({ activeBg: activeTab === 'login' })}>
        <Image
          src="/backgrounds/auth/login-bg.png"
          priority
          fill
          className={bgImage()}
          alt=""
        />
      </div>
      <div className={bg({ activeBg: activeTab === 'signup' })}>
        <Image
          src="/backgrounds/auth/signup-bg.png"
          priority
          fill
          className={bgImage()}
          alt=""
        />
      </div>
    </div>
  )
}

export default AuthLogin
