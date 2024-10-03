import WorkspaceSettingsPage from '@/components/pages/protected/workspace/settings/workspace-settings-page'

import type { Metadata } from 'next/types'

export const metadata: Metadata = {
  title: 'Workspace Settings',
}

const Page: React.FC = () => {
  return <WorkspaceSettingsPage />
}

export default Page
