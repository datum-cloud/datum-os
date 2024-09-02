'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import PageTitle from '@/components/page-title'
import { useContactList } from '@repo/service-api/client'
import { Datum } from '@repo/types'

import ContactControls from './contact-controls'
import ContactSearchPanel from './contact-search-panel'
import { ContactsTable } from './contacts-table'
import { pageStyles } from './page.styles'

const ContactsPage: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { data: session } = useSession()
  const organizationId =
    session?.user.organization ?? ('' as Datum.OrganisationId)

  const {
    data: contacts = [],
    error,
    isLoading,
  } = useContactList(organizationId)

  const [filteredContacts, setFilteredContacts] =
    useState<Datum.Contact[]>(contacts)
  console.log('Contacts FILTERED', contacts)
  const { wrapper } = pageStyles()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase()
    setSearchTerm(searchValue)

    if (contacts) {
      // TODO: Filter contacts properly...
      const filtered = contacts.filter((contact) => !!contact)

      setFilteredContacts(filtered)
    }
  }

  // useEffect(() => {
  //   if (searchTerm.length > 0) {

  //   }
  // }, [searchTerm])

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
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}
      {/* TODO: Use filtered contacts here... */}
      {!error && !isLoading && <ContactsTable contacts={contacts} />}
    </div>
  )
}

export default ContactsPage
