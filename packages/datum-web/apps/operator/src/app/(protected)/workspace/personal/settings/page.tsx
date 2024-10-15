import type { Metadata } from 'next/types'

import WorkspaceSettingsPage from '@/components/pages/protected/workspace/settings/workspace-settings-page'

export const metadata: Metadata = {
  title: 'Personal Workspace Settings',
}

const Page: React.FC = () => {
  return <WorkspaceSettingsPage isPersonal />
}

export default Page
