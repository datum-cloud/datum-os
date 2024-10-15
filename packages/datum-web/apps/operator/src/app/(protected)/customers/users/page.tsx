import type { Metadata } from 'next/types'

import UsersPage from '@/components/pages/protected/workspace/customer/users/users-page'

export const metadata: Metadata = {
  title: 'Users',
}

const Page: React.FC = () => {
  return <UsersPage />
}

export default Page
