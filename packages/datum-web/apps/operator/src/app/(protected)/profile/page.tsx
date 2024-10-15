import type { Metadata } from 'next/types'

import ProfilePage from '@/components/pages/protected/profile/profile-page'

export const metadata: Metadata = {
  title: 'My Profile',
}

const Page: React.FC = () => {
  return <ProfilePage />
}

export default Page
