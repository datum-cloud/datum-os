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
  Plus,
  Trash,
  User,
} from 'lucide-react'
import Link from 'next/link'

import { mockLists, OPERATOR_APP_ROUTES } from '@repo/constants'
import { Button } from '@repo/ui/button'
import { Panel, PanelHeader } from '@repo/ui/panel'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu'
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
import { removeContacts } from '@/query/contacts'
import { formatDate } from '@/utils/date'

import { pageStyles as contactsStyles } from '../contacts/page.styles'
import ContactFormDialog from '../contacts/contacts-form-dialog'
import ContactTable from './contact-table'
import { pageStyles } from './page.styles'
import { Tag } from '@repo/ui/tag'

type ContactPageProps = {
  id: Datum.ContactId
}

const ContactPage = ({ id }: ContactPageProps) => {
  const { data: session } = useSession()
  const organizationId = (session?.user.organization ??
    '') as Datum.OrganisationId
  const [selectedLists, setSelectedLists] = useState<string[]>([])
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const { wrapper } = pageStyles()
  const {
    accordionContainer,
    accordionTrigger,
    accordionContentInner,
    accordionContentOuter,
    contactDropdownItem,
    contactDropdownIcon,
  } = contactsStyles()

  const { error, isLoading, data: contact } = useContact(id)

  async function handleDeletion() {
    await removeContacts(organizationId, [id])
  }

  if (isLoading) {
    return <Loading />
  }

  if (error || !contact) {
    return <div>Whoops... Something went wrong</div>
  }

  const {
    email,
    source,
    lists,
    createdAt,
    enrichedData = {},
    contactHistory,
  } = contact

  return (
    <div className={wrapper()}>
      <Link
        href={OPERATOR_APP_ROUTES.contacts}
        className="flex gap-1 items-center text-sunglow-900 text-button-l"
      >
        <ArrowLeft size={18} />
        Back to Contacts
      </Link>
      <div className="flex items-end justify-between">
        <div className="flex gap-7 justify-start items-center">
          {/* TODO: Fetch user image via Gravatar or similar */}
          <div className="h-[83px] w-[83px] flex items-center justify-center shrink-0 bg-winter-sky-800 rounded-[4px]">
            <User size={60} className="text-winter-sky-900" />
          </div>
          <div className="flex flex-col gap-0 justify-start items-start">
            <h4>Contact Info</h4>
            <h6 className="text-body-l text-blackberry-600">{email}</h6>
            <p className="text-body-sm leading-5 text-blackberry-500">
              Added by {source} on {formatDate(createdAt)}
            </p>
          </div>
        </div>
        <div className="flex justify-start items-stretch gap-4">
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
                onClick={handleDeletion}
                className={contactDropdownItem()}
              >
                <Trash size={18} className={contactDropdownIcon()} />
                Delete contact
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Panel>
        <PanelHeader heading="Latest activity" noBorder />
        <ContactTable history={contactHistory?.events || []} />
      </Panel>
      {Object.keys(enrichedData).length > 0 && (
        <Panel className="bg-blackberry-300/50">
          <PanelHeader
            heading="Enriched Data"
            icon={<Info size={16} />}
            noBorder
          />
          <div className="grid grid-cols-2 rounded-lg border border-blackberry-300">
            {Object.values(enrichedData).map(({ key, value }: any, index) => (
              <div
                className={cn(
                  'w-full flex items-stretch justify-start px-6 py-3 border-blackberry-300',
                  index < Object.keys(enrichedData).length - 2 && 'border-b',
                  (index + 1) % 2 !== 0 && 'border-r',
                )}
              >
                <h6
                  className={
                    'w-1/3 text-blackberry-800/60 font-normal text-body-m'
                  }
                >
                  {key}
                </h6>
                <p className="w-2/3 text-blackberry-800">{value}</p>
              </div>
            ))}
          </div>
        </Panel>
      )}
      <Panel className="bg-blackberry-100/50 gap-4">
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-semibold">Current Lists</h2>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Ellipsis className={contactDropdownIcon()} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="py-2.5 px-2" side="top" align="end">
              <DropdownMenuItem className={contactDropdownItem()}>
                <BellMinus size={18} className={contactDropdownIcon()} />
                Unsubscribe from all
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
                              key={list}
                              variant="success"
                              icon={
                                <Check size={10} className="leading-none" />
                              }
                              iconPosition="left"
                              className="transition-all duration-0 !text-blackberry-500 !font-semibold"
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
                            key={list}
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
        <div className="w-full flex gap-2 flex-wrap">
          {lists.map((list) => (
            <Tag key={list}>{list}</Tag>
          ))}
        </div>
      </Panel>
      <ContactFormDialog
        contact={contact}
        open={openEditDialog}
        setOpen={setOpenEditDialog}
      />
    </div>
  )
}

export default ContactPage
