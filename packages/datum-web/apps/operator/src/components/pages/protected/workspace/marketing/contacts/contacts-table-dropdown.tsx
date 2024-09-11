'use client'

import React, { useState } from 'react'
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
import { mockLists } from '@repo/constants'

type ContactsTableDropdownProps = {
  id: Datum.ContactId
}

const ContactsTableDropdown = ({ id }: ContactsTableDropdownProps) => {
  const [selectedLists, setSelectedLists] = useState<string[]>([])
  const {
    accordionContainer,
    accordionContentInner,
    accordionContentOuter,
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
              <AccordionContent className={accordionContentOuter()}>
                <div className={accordionContentInner()}>
                  {/* TODO: Replace mock lists */}
                  {mockLists.map((list) => {
                    const isSelected = selectedLists.includes(list)

                    if (isSelected) {
                      const newSelectedLists = selectedLists.filter(
                        (selectedList) => list !== selectedList,
                      )

                      return (
                        <Button
                          variant="success"
                          icon={<Check size={10} className="leading-none" />}
                          iconPosition="left"
                          className="transition-all duration-0"
                          onClick={() => setSelectedLists(newSelectedLists)}
                          size="tag"
                        >
                          {list}
                        </Button>
                      )
                    }

                    const newSelectedLists = [...selectedLists, list]

                    return (
                      <Button
                        variant="tag"
                        size="tag"
                        className="transition-all duration-0"
                        onClick={() => setSelectedLists(newSelectedLists)}
                      >
                        {list}
                      </Button>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default ContactsTableDropdown
