'use client'

import { Ellipsis, RotateCw, Trash2 } from 'lucide-react'
import { type UseQueryExecute } from 'urql'

import { useDeleteOrganizationInviteMutation } from '@repo/codegen/src/schema'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu'
import { useToast } from '@repo/ui/use-toast'

import { pageStyles } from './page.styles'

type InviteDropdownProps = {
  inviteId: string
  refetchInvites: UseQueryExecute
}

const InvitesDropdown = ({ inviteId, refetchInvites }: InviteDropdownProps) => {
  const { membersDropdownIcon, membersDropdownItem } = pageStyles()
  const { toast } = useToast()
  const [_, deleteInvite] = useDeleteOrganizationInviteMutation()

  async function handleDeleteInvite() {
    const response = await deleteInvite({ deleteInviteId: inviteId })

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
      refetchInvites({
        requestPolicy: 'network-only',
      })
    }
  }

  async function handleResendInvite() {
    // TODO
    alert('Coming soon')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-0.5">
        <Ellipsis className={membersDropdownIcon()} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="py-2.5 px-2" align="end">
        <DropdownMenuItem
          className={membersDropdownItem()}
          onSelect={handleResendInvite}
        >
          <RotateCw size={18} className={membersDropdownIcon()} /> Resend
          Invitation
        </DropdownMenuItem>
        <DropdownMenuItem
          className={membersDropdownItem()}
          onSelect={handleDeleteInvite}
        >
          <Trash2 size={18} className={membersDropdownIcon()} /> Delete
          Invitation
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { InvitesDropdown }
