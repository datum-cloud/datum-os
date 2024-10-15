'use client'

import { useSession } from 'next-auth/react'
import React, { useState } from 'react'

// import { exportExcel } from '@repo/common/csv'
import type { Datum } from '@repo/types'
import type { ColumnFiltersState, Row } from '@repo/ui/data-table'

import PageTitle from '@/components/page-title'
import { Error } from '@/components/shared/error/error'
import { Loading } from '@/components/shared/loading/loading'
import { useVendors } from '@/hooks/useVendors'

import { pageStyles } from './page.styles'
import VendorsControls from './vendors-controls'
import VendorsDeleteDialog from './vendors-delete-dialog'
// import { Error } from '@/components/shared/error/error'
// import { Loading } from '@/components/shared/loading/loading'
// import { useContacts } from '@/hooks/useContacts'
// import { formatContactsExportData } from '@/utils/export'
import VendorsTable from './vendors-table'

const VendorsPage: React.FC = () => {
  const [exportData, setExportData] = useState<Row<Datum.Vendor>[]>([])
  const [openDeleteDialog, _setOpenDeleteDialog] = useState(false)
  const [selectedVendors, setSelectedVendors] = useState<Datum.Vendor[]>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [query, setQuery] = useState('')
  const { data: session } = useSession()
  const organizationId =
    session?.user.organization ?? ('' as Datum.OrganisationId)
  const { data: vendors = [], error, isLoading } = useVendors(organizationId)
  const { wrapper, header } = pageStyles()

  function handleExport() {
    const now = new Date().toISOString()
    // TODO:
    // const formattedData = formatVendorsExportData(exportData)
    // exportExcel(`Contacts-${now}`, formattedData)
  }

  function setOpenDeleteDialog(input: boolean) {
    _setOpenDeleteDialog(input)
    // NOTE: This is needed to close the dialog without removing pointer events per https://github.com/shadcn-ui/ui/issues/468
    setTimeout(() => (document.body.style.pointerEvents = ''), 500)
  }

  return (
    <div className={wrapper()}>
      <div className={header()}>
        <PageTitle title="Vendors" />
        <VendorsControls
          search={setQuery}
          onDelete={() => setOpenDeleteDialog(true)}
          onExport={handleExport}
          onFilter={setColumnFilters}
          selectedVendors={selectedVendors}
        />
      </div>
      {isLoading ? (
        <Loading className="h-full w-full grow" />
      ) : error ? (
        <Error />
      ) : (
        <VendorsTable
          setGlobalFilter={setQuery}
          setSelection={setSelectedVendors}
          globalFilter={query}
          columnFilters={columnFilters}
          vendors={vendors}
          onRowsFetched={setExportData}
        />
      )}
      <VendorsDeleteDialog
        vendors={selectedVendors}
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
      />
    </div>
  )
}

export default VendorsPage
