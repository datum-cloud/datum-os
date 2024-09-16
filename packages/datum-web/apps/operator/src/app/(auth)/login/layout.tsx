import type { Metadata } from 'next'

import {
  AuthLayout,
  type AuthLayoutProps,
} from '../../../components/layouts/auth'

export const metadata: Metadata = {
  title: 'Admin Login | Sign in to the Datum Operator Portal',
}

export default function Layout({ children }: AuthLayoutProps): JSX.Element {
  return <AuthLayout>{children}</AuthLayout>
}
