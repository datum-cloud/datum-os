'use client'

import { useSession } from 'next-auth/react'
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

import { mockLists } from '@repo/constants'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/shared/sidebar/sidebar-accordion/sidebar-accordion'
import { Button } from '@repo/ui/button'
import { Datum } from '@repo/types'

import { removeContacts } from '@/query/contacts'

import { pageStyles } from './page.styles'
import ContactFormDialog from './contacts-form-dialog'

type ContactsTableDropdownProps = {
  contact: Datum.Contact
}

const ContactsTableDropdown = ({ contact }: ContactsTableDropdownProps) => {
  const { id, lists } = contact
  const [_openEditDialog, _setOpenEditDialog] = useState(false)
  const { data: session } = useSession()
  const organizationId =
    session?.user.organization ?? ('' as Datum.OrganisationId)
  const {
    accordionContainer,
    accordionContentInner,
    accordionContentOuter,
    accordionTrigger,
    contactDropdownItem,
    contactDropdownIcon,
  } = pageStyles()

  async function deleteContact() {
    await removeContacts(organizationId, [id])
  }

  async function unsubscribeAll() {
    // TODO:
    console.log('Unsubscribe all')
  }

  async function setLists(newLists: Datum.ListId[]) {
    // TODO:
    console.log('New lists array', newLists)
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
          <Ellipsis className={contactDropdownIcon()} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="py-2.5 px-2" align="end">
          <DropdownMenuItem
            className={contactDropdownItem()}
            onClick={unsubscribeAll}
          >
            <BellMinus size={18} className={contactDropdownIcon()} />
            Unsubscribe from all
          </DropdownMenuItem>
          <DropdownMenuItem
            className={contactDropdownItem()}
            onClick={() => setOpenEditDialog(true)}
          >
            <Pencil size={18} className={contactDropdownIcon()} />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className={contactDropdownItem()}
            onClick={deleteContact}
          >
            <Trash size={18} className={contactDropdownIcon()} />
            Delete Item
          </DropdownMenuItem>
          <Accordion type="single" collapsible className="w-full px-0">
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
                    const isSelected = lists.includes(list)

                    if (isSelected) {
                      const newSelectedLists = lists.filter(
                        (selectedList) => list !== selectedList,
                      )

                      return (
                        <Button
                          key={list}
                          size="tag"
                          variant="tagSuccess"
                          icon={
                            <Check
                              size={10}
                              className="leading-none pt-[3px]"
                            />
                          }
                          iconPosition="left"
                          onClick={setLists.bind(null, newSelectedLists)}
                        >
                          {list}
                        </Button>
                      )
                    }

                    const newSelectedLists = [...lists, list]

                    return (
                      <Button
                        key={list}
                        variant="tag"
                        size="tag"
                        onClick={setLists.bind(null, newSelectedLists)}
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
      <ContactFormDialog
        contact={contact}
        open={_openEditDialog}
        setOpen={setOpenEditDialog}
      />
    </div>
  )
}

export default ContactsTableDropdown
