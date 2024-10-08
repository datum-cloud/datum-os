'use client'

import { Ellipsis, Minus, Pencil } from 'lucide-react'
import React, { useState } from 'react'

import { useRemoveUserFromOrgMutation } from '@repo/codegen/src/schema'
import type { Datum } from '@repo/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu'

import MembersDeleteDialog from './members-delete-dialog'
import MembersFormDialog from './members-form-dialog'
import { pageStyles } from './page.styles'

type MembersTableDropdownProps = {
  member: Datum.OrgUser
  handleDelete(members: Datum.OrgUser[]): Promise<void>
}

const MembersTableDropdown = ({
  member,
  handleDelete,
}: MembersTableDropdownProps) => {
  const [openEditDialog, _setOpenEditDialog] = useState(false)
  const [openDeleteDialog, _setOpenDeleteDialog] = useState(false)
  const { membersDropdownItem, membersDropdownIcon } = pageStyles()
  const [{ fetching, error }, removeUserFromOrg] =
    useRemoveUserFromOrgMutation()

  function setOpenDeleteDialog(input: boolean) {
    _setOpenDeleteDialog(input)
    // NOTE: This is needed to close the dialog without removing pointer events per https://github.com/shadcn-ui/ui/issues/468
    setTimeout(() => (document.body.style.pointerEvents = ''), 500)
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
            onClick={() => setOpenDeleteDialog(true)}
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
      <MembersDeleteDialog
        members={[member]}
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        handleDelete={handleDelete}
      />
    </div>
  )
}

export default MembersTableDropdown
