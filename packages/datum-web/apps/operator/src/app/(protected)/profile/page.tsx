import type { Metadata } from 'next/types'
import { AvatarUpload } from '@/components/shared/avatar-upload/avatar-upload'
import { pageStyles } from './page.styles'
import { ProfileNameForm } from '@/components/pages/protected/profile/user-settings/profile-name-form'
import PageTitle from '@/components/page-title'

export const metadata: Metadata = {
  title: 'Workspace settings',
}

const Page: React.FC = () => {
  const { wrapper } = pageStyles()
  return (
    <>
      <PageTitle title="My profile" className="mb-10" />
      <div className={wrapper()}>
        <ProfileNameForm />
        <AvatarUpload />
      </div>
    </>
  )
}

export default Page
