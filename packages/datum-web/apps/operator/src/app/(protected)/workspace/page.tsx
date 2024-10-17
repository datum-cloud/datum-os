import { Metadata } from 'next'
import React from 'react'

import WorkspacePage from '@/components/pages/protected/workspace/workspace-page'

export const metadata: Metadata = {
  title: 'My Workspaces',
}

const WorkspaceLanding: React.FC = () => {
  return <WorkspacePage />
}

export default WorkspaceLanding
