'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'

import type { Datum } from '@repo/types'
import type { ColumnFiltersState } from '@repo/ui/data-table'

import { useContacts } from '@/hooks/useContacts'
import PageTitle from '@/components/page-title'
import { removeContacts } from '@/query/contacts'

import ContactsControls from './contacts-controls'
import ContactsTable from './contacts-table'
import { pageStyles } from './page.styles'

const ContactsPage: React.FC = () => {
  const [selectedContacts, setSelectedContacts] = useState<Datum.Contact[]>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [query, setQuery] = useState('')
  const { data: session } = useSession()
  const organizationId =
    session?.user.organization ?? ('' as Datum.OrganisationId)
  const { data: contacts = [], error, isLoading } = useContacts(organizationId)
  const { wrapper, header } = pageStyles()

  function handleExport() {
    // TODO:Export files
    console.log('Export Selected Files')
  }

  async function handleBatchDeletion() {
    await removeContacts(
      organizationId,
      selectedContacts.map(({ id }) => id),
    )

    setSelectedContacts([])
  }

  function handleListAddition(lists: Datum.ListId[]) {
    // TODO: Add to list
    console.log('Add to list')
  }

  return (
    <div className={wrapper()}>
      <div className={header()}>
        <PageTitle title="Contacts" />
        <ContactsControls
          search={setQuery}
          onDelete={handleBatchDeletion}
          onExport={handleExport}
          onFilter={setColumnFilters}
          onListAddition={handleListAddition}
        />
      </div>
      {!error && !isLoading && (
        <ContactsTable
          globalFilter={query}
          setGlobalFilter={setQuery}
          columnFilters={columnFilters}
          contacts={contacts}
          onSelectionChange={setSelectedContacts}
        />
      )}
    </div>
  )
}

export default ContactsPage
