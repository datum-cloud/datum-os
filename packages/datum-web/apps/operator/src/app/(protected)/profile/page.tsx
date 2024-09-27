import type { Metadata } from 'next/types'
import { AvatarUpload } from '@/components/shared/avatar-upload/avatar-upload'
import { pageStyles } from './page.styles'
import { ProfileNameForm } from '@/components/pages/protected/profile/user-settings/profile-name-form'
import PageTitle from '@/components/page-title'
import { getFeatureFlagBool } from '@/providers/feature-flags-server'

export const metadata: Metadata = {
  title: 'Workspace settings',
}

const featureFlagPanel = async () => {
  const localTest = await getFeatureFlagBool('local-test', false)
  console.log('hello from the client')
  return <div>{localTest ? 'the flag was true' : 'the flag was false'}</div>
}

const Page: React.FC = () => {
  const { wrapper } = pageStyles()
  return (
    <>
      <PageTitle title="My profile" className="mb-10" />
      <div className={wrapper()}>
        <ProfileNameForm />
        <AvatarUpload />
        <div className="flex flex-col gap-4">
          {featureFlagPanel()}
        </div>
      </div>
    </>
  )
}

export default Page
