'use client'

import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu'
import { Ellipsis, Pencil, Trash } from 'lucide-react'

import { Datum } from '@repo/types'

import ListsFormDialog from '@/components/pages/protected/workspace/marketing/lists/lists-form-dialog'
import ListDeleteDialog from '@/components/pages/protected/workspace/marketing/list/list-delete-dialog'

import { pageStyles } from './page.styles'

type ListsTableDropdownProps = {
  list: Datum.List
}

const ListsTableDropdown = ({ list }: ListsTableDropdownProps) => {
  const { id } = list
  const [openEditDialog, _setOpenEditDialog] = useState(false)
  const [openDeleteDialog, _setOpenDeleteDialog] = useState(false)
  const { listDropdownItem, listDropdownIcon } = pageStyles()

  function setOpenEditDialog(input: boolean) {
    _setOpenEditDialog(input)
    // NOTE: This is needed to close the dialog without removing pointer events per https://github.com/shadcn-ui/ui/issues/468
    setTimeout(() => (document.body.style.pointerEvents = ''), 500)
  }

  function setOpenDeleteDialog(input: boolean) {
    _setOpenDeleteDialog(input)
    // NOTE: This is needed to close the dialog without removing pointer events per https://github.com/shadcn-ui/ui/issues/468
    setTimeout(() => (document.body.style.pointerEvents = ''), 500)
  }

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger className="p-0.5">
          <Ellipsis className={listDropdownIcon()} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="py-2.5 px-2" align="end">
          <DropdownMenuItem
            className={listDropdownItem()}
            onClick={() => setOpenEditDialog(true)}
          >
            <Pencil size={18} className={listDropdownIcon()} />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className={listDropdownItem()}
            onClick={() => setOpenDeleteDialog(true)}
          >
            <Trash size={18} className={listDropdownIcon()} />
            Delete Item
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ListsFormDialog
        list={list}
        open={openEditDialog}
        setOpen={setOpenEditDialog}
      />
      <ListDeleteDialog
        lists={[list]}
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
      />
    </div>
  )
}

export default ListsTableDropdown
