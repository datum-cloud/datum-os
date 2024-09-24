'use client'

import { useSession } from 'next-auth/react'
import React, { useState } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu'

import { BellMinus, Ellipsis } from 'lucide-react'

import { Datum } from '@repo/types'

import { removeListMembers } from '@/query/lists'

import { pageStyles } from '../lists/page.styles'

type ListContactsTableDropdownProps = {
  listId: Datum.ListId
  contact: Datum.Contact
}

const ListContactsTableDropdown = ({
  contact,
  listId,
}: ListContactsTableDropdownProps) => {
  const { data: session } = useSession()
  const organizationId =
    session?.user.organization ?? ('' as Datum.OrganisationId)
  const { listDropdownIcon, listDropdownItem } = pageStyles()
  const { id } = contact
  const [_openEditDialog, _setOpenEditDialog] = useState(false)

  async function unsubscribe() {
    await removeListMembers(organizationId, listId, [id])
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
            onClick={unsubscribe}
          >
            <BellMinus size={18} className={listDropdownIcon()} />
            Remove from list
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default ListContactsTableDropdown
