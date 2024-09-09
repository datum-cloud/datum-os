'use client'

import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu'
import {
  BellMinus,
  Check,
  ChevronDown,
  Ellipsis,
  Pencil,
  Plus,
  Trash,
} from 'lucide-react'

import { Datum } from '@repo/types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/shared/sidebar/sidebar-accordion/sidebar-accordion'
import { Button } from '@repo/ui/button'

type ContactDropdownProps = {
  id: Datum.ContactId
}

const ContactDropdownMenu = ({ id }: ContactDropdownProps) => {
  // TODO: Add actions...
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger className="p-3">
          <Ellipsis className="text-blackberry-400" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="py-2.5 px-2" align="end">
          <DropdownMenuItem className="w-full flex items-center justify-start gap-3 text-base cursor-pointer">
            <BellMinus size={18} className="text-blackberry-400" />
            Unsubscribe from all
          </DropdownMenuItem>
          <DropdownMenuItem className="w-full flex items-center justify-start gap-3 text-base cursor-pointer">
            <Pencil size={18} className="text-blackberry-400" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="w-full flex items-center justify-start gap-3 text-base cursor-pointer">
            <Trash size={18} className="text-blackberry-400" />
            Delete Item
          </DropdownMenuItem>
          <Accordion type="single" collapsible className="w-full px-2">
            <AccordionItem value="lists" className="w-full border-b-0">
              <AccordionTrigger className="w-full !h-[30px] flex items-center font-normal hover:no-underline justify-between gap-3 py-1.5 text-base cursor-pointer">
                <div className="flex items-center justify-start gap-3">
                  <Plus size={18} className="text-blackberry-400" />
                  Manage Lists
                </div>
                <ChevronDown size={18} className="text-blackberry-400" />
              </AccordionTrigger>
              <AccordionContent className="w-full flex flex-col items-start justify-start gap-2 max-w-full truncate pt-2 pb-0">
                <Button
                  variant="success"
                  icon={<Check size={10} className="leading-none" />}
                  iconPosition="left"
                  size="tag"
                >
                  Newsletter
                </Button>
                <Button variant="tag" size="tag">
                  Admin
                </Button>
                <Button variant="tag" size="tag">
                  Cardholders
                </Button>
                <Button variant="tag" size="tag">
                  Developers
                </Button>
                <Button variant="tag" size="tag">
                  Free Plan
                </Button>
                <Button variant="tag" size="tag">
                  To Renew
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default ContactDropdownMenu
