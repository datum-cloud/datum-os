import PageTitle from '@/components/page-title'
import MembersPage from '@/components/pages/protected/workspace/members/members-page'

import type { Metadata } from 'next/types'

export const metadata: Metadata = {
  title: 'Workspace Users',
}

const Page: React.FC = () => {
  return (
    <>
      <PageTitle title="Users" className="mb-10" />
      <MembersPage />
    </>
  )
}

export default Page
