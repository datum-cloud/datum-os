'use client'

import { Ellipsis, RotateCw, Trash2 } from 'lucide-react'

import { Datum } from '@repo/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu'

import { pageStyles } from './page.styles'

type InviteDropdownProps = {
  inviteId: Datum.InvitationId
  handleDelete(invites: Datum.InvitationId[]): void
  // handleResend(invites: Datum.InvitationId[]): void
}

const InvitesDropdown = ({ inviteId, handleDelete }: InviteDropdownProps) => {
  const { membersDropdownIcon, membersDropdownItem } = pageStyles()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-0.5">
        <Ellipsis className={membersDropdownIcon()} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="py-2.5 px-2" align="end">
        {/* <DropdownMenuItem
          className={membersDropdownItem()}
          onSelect={handleResendInvite}
        >
          <RotateCw size={18} className={membersDropdownIcon()} /> Resend
          Invitation
        </DropdownMenuItem> */}
        <DropdownMenuItem
          className={membersDropdownItem()}
          onClick={() => handleDelete([inviteId])}
        >
          <Trash2 size={18} className={membersDropdownIcon()} /> Delete
          Invitation
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { InvitesDropdown }
