'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'

import { exportExcel } from '@repo/common/csv'
import type { ColumnFiltersState, Row } from '@repo/ui/data-table'
import type { Datum } from '@repo/types'

import { useContacts } from '@/hooks/useContacts'
import PageTitle from '@/components/page-title'
import { removeContacts } from '@/query/contacts'
import { formatContactsExportData } from '@/utils/export'

import ContactsControls from './contacts-controls'
import ContactsTable from './contacts-table'
import { pageStyles } from './page.styles'

const ContactsPage: React.FC = () => {
  const [exportData, setExportData] = useState<Row<Datum.Contact>[]>([])
  const [selectedContacts, setSelectedContacts] = useState<Datum.Contact[]>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [query, setQuery] = useState('')
  const { data: session } = useSession()
  const organizationId =
    session?.user.organization ?? ('' as Datum.OrganisationId)
  const { data: contacts = [], error, isLoading } = useContacts(organizationId)
  const { wrapper, header } = pageStyles()

  function handleExport() {
    const now = new Date().toISOString()
    const formattedData = formatContactsExportData(exportData)
    exportExcel(`Contacts-${now}`, formattedData)
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
          setExportData={setExportData}
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
