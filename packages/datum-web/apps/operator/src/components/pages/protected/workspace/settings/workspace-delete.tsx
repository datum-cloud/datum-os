'use client'

import { TriangleAlert } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@repo/ui/button'
import { Panel, PanelHeader } from '@repo/ui/panel'

import WorkspaceDeleteDialog from '@/components/pages/protected/workspace/settings/workspace-delete-dialog'

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
        <Panel
          align="start"
          destructive
          className="flex flex-row items-start gap-3 justify-start"
        >
          <TriangleAlert className="mt-0.5" />
          <div className="w-full flex flex-col justify-start items-start gap-4">
            <p className="text-util-red-500">
              Deleting your workspace is irreversible.
            </p>
            <Button
              variant="destructiveOutline"
              onClick={() => setOpenDeleteDialog(true)}
            >
              Delete this workspace
            </Button>
          </div>
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
