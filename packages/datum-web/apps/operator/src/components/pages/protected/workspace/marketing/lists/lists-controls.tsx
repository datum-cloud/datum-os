'use client'

import { useState } from 'react'
import { ChevronDown, Import, Plus, Trash, User } from 'lucide-react'

import { Button } from '@repo/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu'
import type { Datum } from '@repo/types'

import ListsFormDialog from './lists-form-dialog'
import { pageStyles } from './page.styles'

type ListsControlsProps = {
  selectedLists: Datum.List[]
  onDelete(): void
  onExport(): void
}

const ListsControls = ({
  onDelete,
  onExport,
  selectedLists,
}: ListsControlsProps) => {
  const { listControls, listDropdownItem, listDropdownIcon } = pageStyles()
  const [_openListDialog, _setOpenListDialog] = useState(false)

  function openListDialog() {
    _setOpenListDialog(true)
  }

  function setOpenListDialog(input: boolean) {
    _setOpenListDialog(input)
    // NOTE: This is needed to close the dialog without removing pointer events per https://github.com/shadcn-ui/ui/issues/468
    setTimeout(() => (document.body.style.pointerEvents = ''), 500)
  }

  return (
    <>
      <div className={listControls()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" icon={<ChevronDown />}>
              Add
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="px-2 py-2.5">
            <DropdownMenuItem
              className={listDropdownItem()}
              onClick={openListDialog}
            >
              <User size={18} className={listDropdownIcon()} />
              Add single list
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button icon={<ChevronDown />}>Actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="px-2 py-2.5">
            <DropdownMenuItem onClick={onExport} className={listDropdownItem()}>
              <Import
                size={18}
                className="text-blackberry-400 transform rotate-180"
              />
              Export
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={selectedLists.length === 0}
              onClick={onDelete}
              className={listDropdownItem()}
            >
              <Trash size={18} className={listDropdownIcon()} />
              Delete items
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ListsFormDialog open={_openListDialog} setOpen={setOpenListDialog} />
    </>
  )
}

export default ListsControls
