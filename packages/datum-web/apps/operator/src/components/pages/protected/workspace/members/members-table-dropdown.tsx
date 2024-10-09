'use client'

import { Ellipsis, Minus, Pencil } from 'lucide-react'
import React, { useState } from 'react'

import type { Datum } from '@repo/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu'

import MembersFormDialog from './members-form-dialog'
import { pageStyles } from './page.styles'

type MembersTableDropdownProps = {
  isAdmin: boolean
  member: Datum.OrgUser
  handleDelete(members: Datum.OrgUser[]): void
}

const MembersTableDropdown = ({
  isAdmin,
  member,
  handleDelete,
}: MembersTableDropdownProps) => {
  const [openEditDialog, _setOpenEditDialog] = useState(false)
  const { membersDropdownItem, membersDropdownIcon } = pageStyles()

  function setOpenEditDialog(input: boolean) {
    _setOpenEditDialog(input)
    // NOTE: This is needed to close the dialog without removing pointer events per https://github.com/shadcn-ui/ui/issues/468
    setTimeout(() => (document.body.style.pointerEvents = ''), 500)
  }

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger disabled={!isAdmin} className="p-0.5">
          <Ellipsis className={membersDropdownIcon()} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="py-2.5 px-2" align="end">
          <DropdownMenuItem
            className={membersDropdownItem()}
            onClick={() => setOpenEditDialog(true)}
          >
            <Pencil size={18} className={membersDropdownIcon()} />
            Edit role
          </DropdownMenuItem>
          <DropdownMenuItem
            className={membersDropdownItem()}
            onClick={() => handleDelete([member])}
          >
            <Minus size={18} className={membersDropdownIcon()} />
            Remove team member
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <MembersFormDialog
        member={member}
        open={openEditDialog}
        setOpen={setOpenEditDialog}
      />
    </div>
  )
}

export default MembersTableDropdown
