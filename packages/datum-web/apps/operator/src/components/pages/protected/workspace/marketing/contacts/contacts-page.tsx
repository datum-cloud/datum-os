'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'

import type { Datum } from '@repo/types'

import { useContacts } from '@/hooks/useContacts'
import PageTitle from '@/components/page-title'

import ContactsControls from './contacts-controls'
import ContactsTable from './contacts-table'
import { pageStyles } from './page.styles'

const ContactsPage: React.FC = () => {
  const [query, setQuery] = useState('')
  const { data: session } = useSession()
  const organizationId =
    session?.user.organization ?? ('' as Datum.OrganisationId)
  const { data: contacts = [], error, isLoading } = useContacts(organizationId)
  const { wrapper, header } = pageStyles()

  return (
    <div className={wrapper()}>
      <div className={header()}>
        <PageTitle title="Contacts" />
        <ContactsControls search={setQuery} />
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
