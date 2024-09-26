'use client'

import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import {
  ArrowLeft,
  BellMinus,
  Check,
  ChevronDown,
  Ellipsis,
  Info,
  Loader,
  Plus,
  Trash,
  User,
} from 'lucide-react'
import Link from 'next/link'

import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { Button } from '@repo/ui/button'
import { Panel } from '@repo/ui/panel'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu'
import { Tag } from '@repo/ui/tag'
import { cn } from '@repo/ui/lib/utils'
import { Datum } from '@repo/types'

import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '@/components/shared/sidebar/sidebar-accordion/sidebar-accordion'
import { Loading } from '@/components/shared/loading/loading'
import { useContact } from '@/hooks/useContacts'
import { useLists } from '@/hooks/useLists'
import { createListMembers, removeListMembers } from '@/query/lists'
import { formatDate } from '@/utils/date'

import { pageStyles as contactsStyles } from '../contacts/page.styles'
import ContactFormDialog from '../contacts/contacts-form-dialog'
import ContactDeleteDialog from './contact-delete-dialog'
import ContactTable from './contact-table'
import { pageStyles } from './page.styles'
import { Error } from '@/components/shared/error/error'

type ContactPageProps = {
  id: Datum.ContactId
}

const ContactPage = ({ id }: ContactPageProps) => {
  const [openDeleteDialog, _setOpenDeleteDialog] = useState(false)
  const { data: session } = useSession()
  const [loadingSubscription, setLoadingSubscription] = useState<Datum.ListId>()
  const organizationId = (session?.user.organization ??
    '') as Datum.OrganisationId
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const {
    wrapper,
    link,
    contactHeader,
    contactCard,
    contactImage,
    contactText,
    contactActions,
    enrichedData: enrichedDataTable,
    enrichedDataCell,
    enrichedDataTitle,
    enrichedDataText,
    listsPanel,
    listsActions,
    listsTrigger,
    listsContainer,
  } = pageStyles()
  const {
    accordionContainer,
    accordionTrigger,
    accordionContentInner,
    accordionContentOuter,
    contactDropdownItem,
    contactDropdownIcon,
    loadingSpinner,
  } = contactsStyles()

  const { error, isLoading, data: contact } = useContact(id)
  const { data: lists = [] } = useLists(organizationId)

  function setOpenDeleteDialog(input: boolean) {
    _setOpenDeleteDialog(input)
    // NOTE: This is needed to close the dialog without removing pointer events per https://github.com/shadcn-ui/ui/issues/468
    setTimeout(() => (document.body.style.pointerEvents = ''), 500)
  }

  async function subscribe(listId: Datum.ListId) {
    setLoadingSubscription(listId)
    await createListMembers(organizationId, listId, [id])
    setLoadingSubscription(undefined)
  }

  async function unsubscribe(listId: Datum.ListId) {
    setLoadingSubscription(listId)
    await removeListMembers(organizationId, listId, [id])
    setLoadingSubscription(undefined)
  }

  if (isLoading) {
    return <Loading />
  }

  if (error || !contact) {
    return <Error />
  }

  const {
    fullName,
    email,
    source,
    contactLists = [],
    createdAt,
    enrichedData = {},
    contactHistory,
  } = contact

  return (
    <div className={wrapper()}>
      <div className="flex flex-col gap-3">
        <Link href={OPERATOR_APP_ROUTES.contacts} className={link()}>
          <ArrowLeft size={18} />
          Back to Contacts
        </Link>
        <div className={contactHeader()}>
          <div className={contactCard()}>
            {/* TODO: Fetch user image via Gravatar or similar */}
            <div className={contactImage()}>
              <User size={60} className="text-winter-sky-900" />
            </div>
            <div className={contactText()}>
              {fullName && (
                <h4 className="text-[27px] leading-[130%]">{fullName}</h4>
              )}
              <h6 className="text-body-l text-blackberry-600">{email}</h6>
              {createdAt && (
                <p className="text-body-sm leading-5 text-blackberry-500">
                  Added by {source} on {formatDate(createdAt)}
                </p>
              )}
            </div>
          </div>
          <div className={contactActions()}>
            <Button variant="outline" onClick={() => setOpenEditDialog(true)}>
              Edit contact info
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button icon={<ChevronDown />} iconPosition="right">
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="px-2 py-2.5">
                <DropdownMenuItem
                  onClick={() => setOpenDeleteDialog(true)}
                  className={contactDropdownItem()}
                >
                  <Trash size={18} className={contactDropdownIcon()} />
                  Delete contact
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {/* <Panel>
        <PanelHeader heading="Latest activity" noBorder />
        <ContactTable history={contactHistory?.events || []} />
      </Panel> */}
      {/* {Object.keys(enrichedData).length > 0 && (
        <Panel className="bg-blackberry-100">
          <PanelHeader
            heading="Enriched Data"
            icon={<Info size={16} />}
            noBorder
          />
          <div className={enrichedDataTable()}>
            {Object.values(enrichedData).map(({ key, value }: any, index) => (
              <div
                key={index}
                className={cn(
                  enrichedDataCell(),
                  index < Object.keys(enrichedData).length - 2 && 'border-b',
                  (index + 1) % 2 !== 0 && 'border-r',
                )}
              >
                <h6 className={enrichedDataTitle()}>{key}</h6>
                <p className={enrichedDataText()}>{value}</p>
              </div>
            ))}
          </div>
        </Panel>
      )} */}
      <Panel className={listsPanel()}>
        <div className={listsActions()}>
          <h2 className="text-xl font-medium">Current Lists</h2>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Ellipsis className={contactDropdownIcon()} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="py-2.5 px-2" side="top" align="end">
              <DropdownMenuItem
                disabled={lists.length === 0}
                className={contactDropdownItem()}
              >
                <BellMinus size={18} className={contactDropdownIcon()} />
                Unsubscribe from all
              </DropdownMenuItem>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="lists" className={accordionContainer()}>
                  <AccordionTrigger
                    disabled={lists.length == 0}
                    className={accordionTrigger()}
                  >
                    <div className={listsTrigger()}>
                      <Plus size={18} className={contactDropdownIcon()} />
                      Manage Lists
                    </div>
                    <ChevronDown size={18} className={contactDropdownIcon()} />
                  </AccordionTrigger>
                  <AccordionContent className={accordionContentOuter()}>
                    <div className={accordionContentInner()}>
                      {lists.map((list) => {
                        const isSelected = contactLists
                          .map(({ id }) => id)
                          .includes(list.id)

                        const isLoadingSubscription =
                          loadingSubscription === list.id

                        if (isSelected) {
                          return (
                            <Button
                              key={list.id}
                              variant="tagSuccess"
                              size="tag"
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
                              onClick={async () => await unsubscribe(list.id)}
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
        </div>
        <div className={listsContainer()}>
          {contactLists.map((list) => (
            <Tag key={list.id}>{list.name}</Tag>
          ))}
        </div>
      </Panel>
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

export default ContactPage
