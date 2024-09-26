'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import {
  Check,
  ChevronDown,
  Import,
  Loader,
  Plus,
  Trash,
  User,
} from 'lucide-react'

import { OPERATOR_APP_ROUTES } from '@repo/constants'
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
  const router = useRouter()
  const {
    accordionContainer,
    accordionContentOuter,
    accordionContentInner,
    accordionTrigger,
    contactControls,
    contactDropdownItem,
    contactDropdownIcon,
    loadingSpinner,
  } = pageStyles()
  const [loadingSubscription, setLoadingSubscription] = useState<Datum.ListId>()
  const [openContactDialog, _setOpenContactDialog] = useState(false)
  const [openActionsMenu, setOpenActionsMenu] = useState(false)
  const { data: session } = useSession()
  const organizationId =
    session?.user.organization ?? ('' as Datum.OrganisationId)
  const { data: lists = [] } = useLists(organizationId)

  function setOpenContactDialog(input: boolean) {
    _setOpenContactDialog(input)
    // NOTE: This is needed to close the dialog without removing pointer events per https://github.com/shadcn-ui/ui/issues/468
    setTimeout(() => (document.body.style.pointerEvents = ''), 500)
  }

  async function subscribe(listId: Datum.ListId) {
    setLoadingSubscription(listId)

    const validContacts = selectedContacts.filter(
      ({ contactLists }) => !contactLists.map(({ id }) => id).includes(listId),
    )

    const validContactIds = validContacts.map(({ id }) => id)

    await createListMembers(organizationId, listId, validContactIds)

    setLoadingSubscription(undefined)
    setOpenActionsMenu(false)
  }

  async function unsubscribe(listId: Datum.ListId) {
    setLoadingSubscription(listId)

    const validContacts = selectedContacts.filter(({ contactLists }) =>
      contactLists.map(({ id }) => id).includes(listId),
    )

    const validContactIds = validContacts.map(({ id }) => id)

    await removeListMembers(organizationId, listId, validContactIds)

    setLoadingSubscription(undefined)
    setOpenActionsMenu(false)
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
              onClick={() => setOpenContactDialog(true)}
            >
              <User size={18} className={contactDropdownIcon()} />
              Add single contact
            </DropdownMenuItem>
            <DropdownMenuItem
              className={contactDropdownItem()}
              onClick={() => router.push(OPERATOR_APP_ROUTES.contactsUpload)}
            >
              <Import size={18} className={contactDropdownIcon()} />
              Import
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu open={openActionsMenu} onOpenChange={setOpenActionsMenu}>
          <DropdownMenuTrigger asChild onClick={() => setOpenActionsMenu(true)}>
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
                <AccordionTrigger
                  disabled={lists.length === 0 || selectedContacts.length === 0}
                  className={accordionTrigger()}
                >
                  <div className="flex items-center justify-start gap-3">
                    <Plus size={18} className={contactDropdownIcon()} />
                    Add to list
                  </div>
                  <ChevronDown size={18} className={contactDropdownIcon()} />
                </AccordionTrigger>
                <AccordionContent className={accordionContentOuter()}>
                  <div className={accordionContentInner()}>
                    {lists.map((list) => {
                      const commonLists = lists.filter(({ id: listId }) =>
                        selectedContacts.every(({ contactLists }) =>
                          contactLists.map(({ id }) => id).includes(listId),
                        ),
                      )
                      const commonListIds = commonLists.map(({ id }) => id)
                      const isSelected = commonListIds.includes(list.id)

                      const isLoadingSubscription =
                        loadingSubscription === list.id

                      if (isSelected) {
                        return (
                          <Button
                            key={list.id}
                            variant="tagSuccess"
                            icon={
                              isLoadingSubscription ? (
                                <Loader className={loadingSpinner()} />
                              ) : (
                                <Check
                                  size={10}
                                  className="leading-none pt-[3px]"
                                />
                              )
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
                          icon={
                            isLoadingSubscription ? (
                              <Loader className={loadingSpinner()} />
                            ) : undefined
                          }
                          iconPosition="left"
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
        open={openContactDialog}
        setOpen={setOpenContactDialog}
      />
    </>
  )
}

export default ContactsControls
