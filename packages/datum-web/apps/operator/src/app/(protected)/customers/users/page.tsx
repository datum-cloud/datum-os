import UsersPage from '@/components/pages/protected/workspace/customer/users/users-page'

import type { Metadata } from 'next/types'

export const metadata: Metadata = {
  title: 'Workspace Users',
}

const Page: React.FC = () => {
  return <UsersPage />
}

export default Page
