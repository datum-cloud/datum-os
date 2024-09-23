'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'

import { exportExcel } from '@repo/common/csv'
import type { ColumnFiltersState, Row } from '@repo/ui/data-table'
import type { Datum } from '@repo/types'

import { useContacts } from '@/hooks/useContacts'
import PageTitle from '@/components/page-title'
import { formatContactsExportData } from '@/utils/export'

import ContactsControls from './contacts-controls'
import ContactsTable from './contacts-table'
import { pageStyles } from './page.styles'
import ContactDeleteDialog from '@/components/pages/protected/workspace/marketing/contact/contact-delete-dialog'
import { Loading } from '@/components/shared/loading/loading'
import { Error } from '@/components/shared/error/error'

const ContactsPage: React.FC = () => {
  const [exportData, setExportData] = useState<Row<Datum.Contact>[]>([])
  const [openDeleteDialog, _setOpenDeleteDialog] = useState(false)
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

  function setOpenDeleteDialog(input: boolean) {
    _setOpenDeleteDialog(input)
    // NOTE: This is needed to close the dialog without removing pointer events per https://github.com/shadcn-ui/ui/issues/468
    setTimeout(() => (document.body.style.pointerEvents = ''), 500)
  }

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <Error />
  }

  return (
    <div className={wrapper()}>
      <div className={header()}>
        <PageTitle title="Contacts" />
        <ContactsControls
          search={setQuery}
          onDelete={() => setOpenDeleteDialog(true)}
          onExport={handleExport}
          onFilter={setColumnFilters}
          selectedContacts={selectedContacts}
        />
      </div>
      <ContactsTable
        setExportData={setExportData}
        setGlobalFilter={setQuery}
        setSelection={setSelectedContacts}
        globalFilter={query}
        columnFilters={columnFilters}
        contacts={contacts}
      />
      <ContactDeleteDialog
        contacts={selectedContacts}
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        redirect
      />
    </div>
  )
}

export default ContactsPage
