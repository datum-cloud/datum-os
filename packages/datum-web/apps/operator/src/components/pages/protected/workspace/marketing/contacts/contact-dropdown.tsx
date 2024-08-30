'use client'

import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu'
import { BellMinus, Ellipsis, Pencil, Plus, Trash } from 'lucide-react'

import { Datum } from '@repo/types'

type ContactDropdownProps = {
  id: Datum.ContactId
}

const ContactDropdownMenu = ({ id }: ContactDropdownProps) => {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger className="p-3">
          <Ellipsis className="text-blackberry-400" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="py-2.5 px-2" align="end">
          <DropdownMenuItem>
            <div className="w-full flex items-center justify-start gap-3 text-base cursor-pointer">
              <BellMinus size={18} className="text-blackberry-400" />
              Unsubscribe from all
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="w-full flex items-center justify-start gap-3 text-base cursor-pointer">
              <Pencil size={18} className="text-blackberry-400" />
              Edit
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="w-full flex items-center justify-start gap-3 text-base cursor-pointer">
              <Trash size={18} className="text-blackberry-400" />
              Delete Item
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="w-full flex items-center justify-start gap-3 text-base cursor-pointer">
              <Plus size={18} className="text-blackberry-400" />
              Manage Lists
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default ContactDropdownMenu
