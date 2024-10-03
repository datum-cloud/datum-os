'use client'

import React, { useState } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu'

import { BellMinus, Ellipsis } from 'lucide-react'

import { useDeleteOrganizationInviteMutation } from '@repo/codegen/src/schema'
import { Datum } from '@repo/types'

import { pageStyles } from './page.styles'
import { toast } from '@repo/ui/use-toast'

type UserInvitationTableDropdownProps = {
  invitationId: Datum.InvitationId
  refetch(): void
}

const UserInvitationTableDropdown = ({
  invitationId,
  refetch,
}: UserInvitationTableDropdownProps) => {
  const { userDropdownIcon, userDropdownItem } = pageStyles()
  const [_openEditDialog, _setOpenEditDialog] = useState(false)
  const [_, deleteInvite] = useDeleteOrganizationInviteMutation()

  const deleteInvitation = async () => {
    const response = await deleteInvite({ deleteInviteId: invitationId })

    if (response.error) {
      toast({
        title: 'There was a problem deleting this invite, please try again',
        variant: 'destructive',
      })
    }

    if (response.data) {
      toast({
        title: 'Invite deleted successfully',
        variant: 'success',
      })
      refetch()
    }
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
