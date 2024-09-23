'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Check, ChevronDown, Import, Plus, Trash, User } from 'lucide-react'

import { Button } from '@repo/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu'
import type { ColumnFiltersState } from '@repo/ui/data-table'
import type { Datum } from '@repo/types'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/shared/sidebar/sidebar-accordion/sidebar-accordion'
import { useLists } from '@/hooks/useLists'
import { createListMembers, removeListMembers } from '@/query/lists'

import ContactFormDialog from './contacts-form-dialog'
import FilterContactDialog from './contacts-filter-dialog'
import ImportContactsDialog from './contacts-import-dialog'
import ContactsSearch from './contacts-search'
import { pageStyles } from './page.styles'

type ContactsControlsProps = {
  search(query: string): void
  onDelete(): void
  onExport(): void
  onFilter(columnFilters: ColumnFiltersState): void
  selectedContacts: Datum.Contact[]
}

const ContactsControls = ({
  search,
  onDelete,
  onExport,
  onFilter,
  selectedContacts,
}: ContactsControlsProps) => {
  const {
    accordionContainer,
    accordionContentOuter,
    accordionContentInner,
    accordionTrigger,
    contactControls,
    contactDropdownItem,
    contactDropdownIcon,
  } = pageStyles()
  const [_openContactDialog, _setOpenContactDialog] = useState(false)
  const [_openImportDialog, _setOpenImportDialog] = useState(false)
  const { data: session } = useSession()
  const organizationId =
    session?.user.organization ?? ('' as Datum.OrganisationId)
  const { data: lists = [] } = useLists(organizationId)

  function openContactDialog() {
    _setOpenContactDialog(true)
  }

  function openImportDialog() {
    _setOpenImportDialog(true)
  }

  function setOpenContactDialog(input: boolean) {
    _setOpenContactDialog(input)
    // NOTE: This is needed to close the dialog without removing pointer events per https://github.com/shadcn-ui/ui/issues/468
    setTimeout(() => (document.body.style.pointerEvents = ''), 500)
  }

  function setOpenImportDialog(input: boolean) {
    _setOpenImportDialog(input)
    // NOTE: This is needed to close the dialog without removing pointer events per https://github.com/shadcn-ui/ui/issues/468
    setTimeout(() => (document.body.style.pointerEvents = ''), 500)
  }

  async function subscribe(listId: Datum.ListId) {
    const selectedContactsIds = selectedContacts.map(({ id }) => id)
    await createListMembers(organizationId, listId, selectedContactsIds)
  }

  async function unsubscribe(listId: Datum.ListId) {
    const selectedContactsIds = selectedContacts.map(({ id }) => id)
    await removeListMembers(organizationId, listId, selectedContactsIds)
  }

  return (
    <>
      <div className={contactControls()}>
        <ContactsSearch search={search} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" icon={<ChevronDown />}>
              Add
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="px-2 py-2.5">
            <DropdownMenuItem
              className={contactDropdownItem()}
              onClick={openContactDialog}
            >
              <User size={18} className={contactDropdownIcon()} />
              Add single contact
            </DropdownMenuItem>
            <DropdownMenuItem
              className={contactDropdownItem()}
              onClick={openImportDialog}
            >
              <Import size={18} className={contactDropdownIcon()} />
              Import
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" icon={<ChevronDown />}>
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="px-2 py-2.5">
            <DropdownMenuItem
              onClick={onExport}
              className={contactDropdownItem()}
            >
              <Import
                size={18}
                className="text-blackberry-400 transform rotate-180"
              />
              Export
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              disabled={selectedContacts.length === 0}
              className={contactDropdownItem()}
            >
              <Trash size={18} className={contactDropdownIcon()} />
              Delete items
            </DropdownMenuItem>
            <Accordion type="single" collapsible className="w-full px-0">
              <AccordionItem value="lists" className={accordionContainer()}>
                <AccordionTrigger className={accordionTrigger()}>
                  <div className="flex items-center justify-start gap-3">
                    <Plus size={18} className={contactDropdownIcon()} />
                    Add to list
                  </div>
                  <ChevronDown size={18} className={contactDropdownIcon()} />
                </AccordionTrigger>
                <AccordionContent className={accordionContentOuter()}>
                  <div className={accordionContentInner()}>
                    {lists.map((list) => {
                      const isSelected =
                        selectedContacts.length > 0 &&
                        !selectedContacts.some(({ contactLists }) => {
                          return !contactLists.some(({ id }) => id === list.id)
                        })

                      if (isSelected) {
                        return (
                          <Button
                            key={list.id}
                            variant="tagSuccess"
                            icon={
                              <Check
                                size={10}
                                className="leading-none pt-[3px]"
                              />
                            }
                            iconPosition="left"
                            className="transition-all duration-0"
                            onClick={async () => await unsubscribe(list.id)}
                            size="tag"
                          >
                            {list.name}
                          </Button>
                        )
                      }

                      return (
                        <Button
                          key={list.id}
                          variant="tag"
                          size="tag"
                          className="transition-all duration-0"
                          onClick={async () => await subscribe(list.id)}
                        >
                          {list.name}
                        </Button>
                      )
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </DropdownMenuContent>
        </DropdownMenu>
        <FilterContactDialog onFilter={onFilter} />
      </div>
      <ContactFormDialog
        open={_openContactDialog}
        setOpen={setOpenContactDialog}
      />
      <ImportContactsDialog
        open={_openImportDialog}
        setOpen={setOpenImportDialog}
      />
    </>
  )
}

export default ContactsControls
