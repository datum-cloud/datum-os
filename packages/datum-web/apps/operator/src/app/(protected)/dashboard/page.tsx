import { Metadata } from 'next'
import React from 'react'

import DashboardPage from '@/components/pages/protected/workspace/dashboard/dashboard'

export const metadata: Metadata = {
  title: 'Dashboard',
}

const DashboardLanding = () => {
  return <DashboardPage />
}

export default DashboardLanding
