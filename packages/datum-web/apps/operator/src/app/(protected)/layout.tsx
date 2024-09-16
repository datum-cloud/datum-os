import type { Metadata } from 'next'
import { DashboardLayout } from '@/components/layouts/dashboard/dashboard'

export const metadata: Metadata = {
  title: {
    template: '%s | Datum Operator Portal',
    default: 'Dashboard | Datum Operator Portal',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return <DashboardLayout>{children}</DashboardLayout>
}
