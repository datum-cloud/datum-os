'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'

import PageTitle from '@/components/page-title'
import { useContacts } from '@/hooks/useContacts'
import { Datum } from '@repo/types'

import ContactControls from './contact-controls'
import { ContactsTable } from './contacts-table'
import { pageStyles } from './page.styles'

const ContactsPage: React.FC = () => {
  const [query, setQuery] = useState('')
  const { data: session } = useSession()
  const organizationId =
    session?.user.organization ?? ('' as Datum.OrganisationId)
  const { data: contacts = [], error, isLoading } = useContacts(organizationId)
  const { wrapper } = pageStyles()

  return (
    <div className={wrapper()}>
      <div className="flex items-stretch justify-between">
        <PageTitle title="Contacts" />
        <ContactControls search={setQuery} />
      </div>
      {!error && !isLoading && (
        <ContactsTable
          globalFilter={query}
          setGlobalFilter={setQuery}
          contacts={contacts}
        />
      )}
    </div>
  )
}

export default ContactsPage
