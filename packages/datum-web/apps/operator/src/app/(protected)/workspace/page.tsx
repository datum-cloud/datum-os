'use client'

import React from 'react'
import { CreateWorkspaceForm } from '@/components/shared/workspace/create-workspace/create-workspace'
import { ExistingWorkspaces } from '@/components/shared/workspace/existing-workspaces/existing-workspaces'
import PageTitle from '@/components/page-title'

const WorkspaceLanding: React.FC = () => {
  return (
    <section>
      <PageTitle title="My Workspaces" className="mb-10" />
      <ExistingWorkspaces />
      <CreateWorkspaceForm />
    </section>
  )
}

export default WorkspaceLanding
