'use client'

import React, { useState } from 'react'
import {
  ArrowLeft,
  BellMinus,
  Check,
  ChevronDown,
  Ellipsis,
  Plus,
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
import { Datum } from '@repo/types'

import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '@/components/shared/sidebar/sidebar-accordion/sidebar-accordion'
import { formatDate } from '@/utils/date'

import { pageStyles as contactsStyles } from '../contacts/page.styles'
import { tagStyles } from '../contacts/page.styles'
import { pageStyles } from './page.styles'

type ContactPageProps = {
  id: Datum.ContactId
}

const ContactPage = ({ id }: ContactPageProps) => {
  const [selectedLists, setSelectedLists] = useState<string[]>([])
  const { wrapper } = pageStyles()
  const {
    accordionContainer,
    accordionTrigger,
    accordionContentInner,
    accordionContentOuter,
    contactDropdownItem,
    contactDropdownIcon,
  } = contactsStyles()

  //   TODO: Replace mock data...
  //   const { error, isLoading, data: contact } = useContact(id)
  const MOCK_CONTACT = {
    id: '01J7A35QY582XPTHXF03GFA7J5' as Datum.ContactId,
    createdAt: new Date('2024-09-08T19:33:09.583385-05:00'),
    updatedAt: new Date('2024-09-08T19:33:09.583385-05:00'),
    fullName: 'Roxanne Banks',
    title: 'Developer',
    email: 'rox@company.ai' as Datum.Email,
    status: 'ACTIVE',
    company: 'Google',
    address: '',
    phoneNumber: '+1234567890',
    source: 'form',
    lists: ['Newsletter', 'Admin', 'Cardholders', 'Developers'],
  } as Datum.Contact

  const { email, source, lists, createdAt } = MOCK_CONTACT

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
          <Button variant="outline">Edit contact info</Button>
          <Button icon={<ChevronDown />} iconPosition="right">
            Actions
          </Button>
        </div>
      </div>
      <Panel>
        <PanelHeader heading="Latest activity" noBorder />
        {/* TODO Table */}
      </Panel>
      <Panel className="bg-blackberry-300/50">
        <PanelHeader heading="Enriched Data" noBorder />
      </Panel>
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
            <span key={list} className={tagStyles()}>
              {list}
            </span>
          ))}
        </div>
      </Panel>
    </div>
  )
}

export default ContactPage
