'use client'

import { useState } from 'react'

import { Panel, PanelHeader } from '@repo/ui/panel'

import WorkspaceDeleteDialog from '@/components/pages/protected/workspace/settings/workspace-delete-dialog'
import { Button } from '@repo/ui/button'
import { TriangleAlert } from 'lucide-react'

type WorkspaceDeleteProps = {
  name: string
  handleDelete(): Promise<void>
}

const WorkspaceDelete = ({ name, handleDelete }: WorkspaceDeleteProps) => {
  const [openDeleteDialog, _setOpenDeleteDialog] = useState(false)
  function setOpenDeleteDialog(input: boolean) {
    _setOpenDeleteDialog(input)
    // NOTE: This is needed to close the dialog without removing pointer events per https://github.com/shadcn-ui/ui/issues/468
    setTimeout(() => (document.body.style.pointerEvents = ''), 500)
  }
  return (
    <>
      <Panel>
        <PanelHeader heading="Delete workspace" noBorder />
        <Panel align="start" destructive>
          <div className="w-full flex justify-start items-center gap-3">
            <TriangleAlert />
            <p className="text-util-red-500">
              Deleting your workspace is irreversible.
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={() => setOpenDeleteDialog(true)}
          >
            Delete this workspace
          </Button>
        </Panel>
      </Panel>
      <WorkspaceDeleteDialog
        name={name}
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        handleDelete={handleDelete}
      />
    </>
  )
}

export { WorkspaceDelete }
