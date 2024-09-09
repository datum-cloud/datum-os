'use client'

import React from 'react'
import { ArrowLeft, ChevronDown, User } from 'lucide-react'
import Link from 'next/link'

import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { Datum } from '@repo/types'

import { pageStyles } from './page.styles'
import { formatDate } from '@/utils/date'
import { Button } from '@repo/ui/button'
import { Panel, PanelHeader } from '@repo/ui/panel'

type ContactPageProps = {
  id: Datum.ContactId
}

const ContactPage = ({ id }: ContactPageProps) => {
  const { wrapper } = pageStyles()

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
    lists: [],
  } as Datum.Contact

  const { email, source, createdAt } = MOCK_CONTACT

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
      <Panel className="bg-blackberry-100">
        <PanelHeader heading="Enriched Data" />
      </Panel>
      <Panel className="bg-blackberry-100">
        <PanelHeader heading="Current Lists" />
      </Panel>
    </div>
  )
}

export default ContactPage
