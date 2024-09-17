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

import { pageStyles } from './page.styles'
import { removeLists } from '@/query/lists'

type ListsTableDropdownProps = {
  list: Datum.List
}

const ListsTableDropdown = ({ list }: ListsTableDropdownProps) => {
  const { id } = list
  const [_openEditDialog, _setOpenEditDialog] = useState(false)
  const { data: session } = useSession()
  const organizationId =
    session?.user.organization ?? ('' as Datum.OrganisationId)
  const { listDropdownItem, listDropdownIcon } = pageStyles()

  async function deleteList() {
    await removeLists(organizationId, [id])
  }

  async function setLists(newLists: Datum.ListId[]) {
    // TODO:
    console.log('New lists array', newLists)
  }

  function setOpenEditDialog(input: boolean) {
    _setOpenEditDialog(input)
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
          <DropdownMenuItem className={listDropdownItem()} onClick={deleteList}>
            <Trash size={18} className={listDropdownIcon()} />
            Delete Item
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default ListsTableDropdown
