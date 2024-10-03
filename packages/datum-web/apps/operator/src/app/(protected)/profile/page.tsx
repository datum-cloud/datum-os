import ProfilePage from '@/components/pages/protected/profile/profile-page'

import type { Metadata } from 'next/types'

export const metadata: Metadata = {
  title: 'Profile settings',
}

const Page: React.FC = () => {
  return <ProfilePage />
}

export default Page
