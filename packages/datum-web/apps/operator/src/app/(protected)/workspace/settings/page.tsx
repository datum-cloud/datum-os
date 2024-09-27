import type { Metadata } from 'next/types'
import { WorkspaceNameForm } from '@/components/pages/protected/workspace/general-settings/workspace-name-form'
import { AvatarUpload } from '@/components/shared/avatar-upload/avatar-upload'
import { WorkspaceEmailForm } from '@/components/pages/protected/workspace/general-settings/workspace-email-form'
import { WorkspaceDelete } from '@/components/pages/protected/workspace/general-settings/workspace-delete'
import PageTitle from '@/components/page-title'

import { pageStyles } from './page.styles'

export const metadata: Metadata = {
  title: 'Workspace Settings',
}

const Page: React.FC = () => {
  const { wrapper } = pageStyles()
  return (
    <>
      <PageTitle title="Workspace Settings" className="mb-10" />
      <div className={wrapper()}>
        <WorkspaceNameForm />
        <AvatarUpload />
        <WorkspaceEmailForm />
        <WorkspaceDelete />
      </div>
    </>
  )
}

export default Page
