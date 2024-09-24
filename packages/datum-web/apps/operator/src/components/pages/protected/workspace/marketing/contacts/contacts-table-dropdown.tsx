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
  Loader,
  Pencil,
  Plus,
  Trash,
} from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/shared/sidebar/sidebar-accordion/sidebar-accordion'
import { Button } from '@repo/ui/button'
import { Datum } from '@repo/types'

import { pageStyles } from './page.styles'
import ContactFormDialog from './contacts-form-dialog'
import { useLists } from '@/hooks/useLists'
import { createListMembers, removeListMembers } from '@/query/lists'
import { useAsyncFn } from '@/hooks/useAsyncFn'
import ContactDeleteDialog from '@/components/pages/protected/workspace/marketing/contact/contact-delete-dialog'

type ContactsTableDropdownProps = {
  contact: Datum.Contact
}

type LoadingState = {
  contact: Datum.ContactId
  list: Datum.ListId
}

const ContactsTableDropdown = ({ contact }: ContactsTableDropdownProps) => {
  const { id, contactLists = [] } = contact
  const [openEditDialog, _setOpenEditDialog] = useState(false)
  const [openDeleteDialog, _setOpenDeleteDialog] = useState(false)
  const [{ loading: loadingUnsubscribe }, removeSubscriber] =
    useAsyncFn(removeListMembers)
  const [{ loading: loadingsubscribe }, addSubscriber] =
    useAsyncFn(createListMembers)
  const [loadingSubscription, setLoadingSubscription] = useState<LoadingState>()
  const { data: session } = useSession()
  const organizationId =
    session?.user.organization ?? ('' as Datum.OrganisationId)
  const { data: allLists = [] } = useLists(organizationId)
  const {
    accordionContainer,
    accordionContentInner,
    accordionContentOuter,
    accordionTrigger,
    contactDropdownItem,
    contactDropdownIcon,
    loadingSpinner,
  } = pageStyles()

  function setOpenDeleteDialog(input: boolean) {
    _setOpenDeleteDialog(input)
    // NOTE: This is needed to close the dialog without removing pointer events per https://github.com/shadcn-ui/ui/issues/468
    setTimeout(() => (document.body.style.pointerEvents = ''), 500)
  }

  async function unsubscribeAll() {
    await Promise.all(
      contactLists.map(({ id: listId }) =>
        removeSubscriber(organizationId, listId, [id]),
      ),
    )
  }

  async function subscribe(listId: Datum.ListId) {
    setLoadingSubscription({ contact: id, list: listId })
    await addSubscriber(organizationId, listId, [id])
    setLoadingSubscription(undefined)
  }

  async function unsubscribe(listId: Datum.ListId) {
    setLoadingSubscription({ contact: id, list: listId })
    await removeSubscriber(organizationId, listId, [id])
    setLoadingSubscription(undefined)
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
            onClick={() => setOpenDeleteDialog(true)}
          >
            <Trash size={18} className={contactDropdownIcon()} />
            Delete Item
          </DropdownMenuItem>
          <Accordion type="single" collapsible className="w-full px-0">
            <AccordionItem
              value="contactLists"
              className={accordionContainer()}
            >
              <AccordionTrigger
                disabled={allLists.length === 0}
                className={accordionTrigger()}
              >
                <div className="flex items-center justify-start gap-3">
                  <Plus size={18} className={contactDropdownIcon()} />
                  Manage Lists
                </div>
                <ChevronDown size={18} className={contactDropdownIcon()} />
              </AccordionTrigger>
              <AccordionContent className={accordionContentOuter()}>
                <div className={accordionContentInner()}>
                  {allLists.map(({ id: listId, name }) => {
                    const isSelected = contactLists.find(
                      (item) => item.id === listId,
                    )
                    const isLoadingSubscription =
                      loadingSubscription &&
                      loadingSubscription.contact === id &&
                      loadingSubscription.list === listId

                    if (isSelected) {
                      return (
                        <Button
                          key={listId}
                          size="tag"
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
                          onClick={async () => await unsubscribe(listId)}
                        >
                          {name}
                        </Button>
                      )
                    }

                    return (
                      <Button
                        key={listId}
                        variant="tag"
                        size="tag"
                        icon={
                          isLoadingSubscription ? (
                            <Loader className={loadingSpinner()} />
                          ) : undefined
                        }
                        iconPosition="left"
                        onClick={async () => await subscribe(listId)}
                      >
                        {name}
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
        open={openEditDialog}
        setOpen={setOpenEditDialog}
      />
      <ContactDeleteDialog
        contacts={[contact]}
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        redirect
      />
    </div>
  )
}

export default ContactsTableDropdown
