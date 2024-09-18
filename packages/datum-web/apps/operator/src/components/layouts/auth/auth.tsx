'use client'

import { authStyles } from './auth.styles'

export interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { base } = authStyles()

  return <div className={base()}>{children}</div>
}
