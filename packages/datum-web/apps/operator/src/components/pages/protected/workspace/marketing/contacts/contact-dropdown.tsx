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

import { pageStyles } from './page.styles'

type ContactDropdownProps = {
  id: Datum.ContactId
}

const ContactDropdownMenu = ({ id }: ContactDropdownProps) => {
  const {
    accordionContainer,
    accordionContent,
    accordionTrigger,
    contactDropdownItem,
    contactDropdownIcon,
  } = pageStyles()

  // TODO: Add actions...
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger className="p-3">
          <Ellipsis className={contactDropdownIcon()} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="py-2.5 px-2" align="end">
          <DropdownMenuItem className={contactDropdownItem()}>
            <BellMinus size={18} className={contactDropdownIcon()} />
            Unsubscribe from all
          </DropdownMenuItem>
          <DropdownMenuItem className={contactDropdownItem()}>
            <Pencil size={18} className={contactDropdownIcon()} />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className={contactDropdownItem()}>
            <Trash size={18} className={contactDropdownIcon()} />
            Delete Item
          </DropdownMenuItem>
          <Accordion type="single" collapsible className="w-full px-2">
            <AccordionItem value="lists" className={accordionContainer()}>
              <AccordionTrigger className={accordionTrigger()}>
                <div className="flex items-center justify-start gap-3">
                  <Plus size={18} className={contactDropdownIcon()} />
                  Manage Lists
                </div>
                <ChevronDown size={18} className={contactDropdownIcon()} />
              </AccordionTrigger>
              <AccordionContent className={accordionContent()}>
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
