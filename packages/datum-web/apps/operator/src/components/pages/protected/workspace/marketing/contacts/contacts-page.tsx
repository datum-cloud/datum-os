'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'

import PageTitle from '@/components/page-title'
import { Datum } from '@repo/types'

import ContactControls from './contact-controls'
import ContactSearchPanel from './contact-search-panel'
import { CONTACT_COLUMNS, ContactsTable } from './contacts-table'
import { pageStyles } from './page.styles'
import { useContacts } from '@/hooks/useContacts'

const ContactsPage: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { data: session } = useSession()
  const organizationId =
    session?.user.organization ?? ('' as Datum.OrganisationId)
  const { data: contacts = [], error, isLoading } = useContacts(organizationId)
  const { wrapper } = pageStyles()

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase()
    setSearchTerm(searchValue)
  }

  const filteredContacts = useMemo(() => {
    if (searchTerm.length > 0) {
      // TODO: implement search
      // return contacts.filter((contact) =>
      //   contact.name.toLowerCase().includes(searchTerm) // Adjust based on how you search contacts
      // )
    }

    return contacts
  }, [contacts, searchTerm])

  function toggleSearch() {
    setShowSearch(!showSearch)
  }

  return (
    <div className={wrapper()}>
      <div className="flex items-stretch justify-between">
        <PageTitle title="Contacts" />
        <ContactControls searchOpen={showSearch} toggleSearch={toggleSearch} />
      </div>
      {showSearch && (
        <ContactSearchPanel
          columns={CONTACT_COLUMNS}
          query={searchTerm}
          setQuery={setSearchTerm}
        />
      )}
      {!error && !isLoading && <ContactsTable contacts={filteredContacts} />}
    </div>
  )
}

export default ContactsPage
