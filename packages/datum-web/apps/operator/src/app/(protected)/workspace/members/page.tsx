import MembersPage from '@/components/pages/protected/workspace/members/members-page'

import type { Metadata } from 'next/types'

export const metadata: Metadata = {
  title: 'Workspace Team Members',
}

const Page: React.FC = () => {
  return <MembersPage />
}

export default Page
