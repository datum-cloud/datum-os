'use client'

import React from 'react'

import PageTitle from '@/components/page-title'
import { Datum } from '@repo/types'

import { pageStyles } from './page.styles'
import { useContact } from '@/hooks/useContacts'

type ContactPageProps = {
  id: Datum.ContactId
}

const ContactPage = ({ id }: ContactPageProps) => {
  const { wrapper } = pageStyles()

  //   TODO: Replace mock data...
  //   const { error, isLoading, data: contact } = useContact(id)

  const mockContact = {} as Datum.ContactId

  return (
    <div className={wrapper()}>
      <div className="flex items-stretch justify-between">
        <PageTitle title="Contacts" />
      </div>
    </div>
  )
}

export default ContactPage
