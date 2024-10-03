'use client'

import React, { useState } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu'

import { BellMinus, Ellipsis } from 'lucide-react'

import { Datum } from '@repo/types'

import { pageStyles } from './page.styles'

type UserInvitationTableDropdownProps = {
  invitationId: Datum.InvitationId
}

const UserInvitationTableDropdown = ({
  invitationId,
}: UserInvitationTableDropdownProps) => {
  const { userDropdownIcon, userDropdownItem } = pageStyles()
  const [_openEditDialog, _setOpenEditDialog] = useState(false)

  async function deleteInvitation() {
    // TODO: DELETE INVITATION
    console.log('DELETE INVITATION', invitationId)
  }

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger className="p-0.5">
          <Ellipsis className={userDropdownIcon()} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="py-2.5 px-2" align="end">
          <DropdownMenuItem
            className={userDropdownItem()}
            onClick={deleteInvitation}
          >
            <BellMinus size={18} className={userDropdownIcon()} />
            Delete Invitation
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default UserInvitationTableDropdown
