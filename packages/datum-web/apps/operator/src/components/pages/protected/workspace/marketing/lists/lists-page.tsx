'use client'

import { useSession } from 'next-auth/react'
import React, { useState } from 'react'

import { exportExcel } from '@repo/common/csv'
import type { Datum } from '@repo/types'
import { Row } from '@repo/ui/data-table'

import PageTitle from '@/components/page-title'
import ListDeleteDialog from '@/components/pages/protected/workspace/marketing/list/list-delete-dialog'
import ListsControls from '@/components/pages/protected/workspace/marketing/lists/lists-controls'
import { Error } from '@/components/shared/error/error'
import { Loading } from '@/components/shared/loading/loading'
import { useLists } from '@/hooks/useLists'
import { formatListsExportData } from '@/utils/export'

import ListsTable from './lists-table'
import { pageStyles } from './page.styles'

const ListsPage = () => {
  const [exportData, setExportData] = useState<Row<Datum.List>[]>([])
  const [selectedLists, setSelectedLists] = useState<Datum.List[]>([])
  const [openDeleteDialog, _setOpenDeleteDialog] = useState(false)
  const [query, setQuery] = useState('')
  const { data: session } = useSession()
  const organizationId =
    session?.user.organization ?? ('' as Datum.OrganisationId)
  const {
    data: lists = [],
    error,
    isLoading,
    isRefetching,
  } = useLists(organizationId)
  const { wrapper, header } = pageStyles()

  function handleExport() {
    const now = new Date().toISOString()
    const formattedData = formatListsExportData(exportData)
    exportExcel(`Lists-${now}`, formattedData)
  }

  function setOpenDeleteDialog(input: boolean) {
    _setOpenDeleteDialog(input)
    // NOTE: This is needed to close the dialog without removing pointer events per https://github.com/shadcn-ui/ui/issues/468
    setTimeout(() => (document.body.style.pointerEvents = ''), 500)
  }

  if (isLoading && !isRefetching) {
    return <Loading className="h-full w-full grow" />
  }

  if (error) {
    return <Error />
  }

  return (
    <div className={wrapper()}>
      <div className={header()}>
        <PageTitle title="Lists" />
        <ListsControls
          selectedLists={selectedLists}
          onDelete={() => setOpenDeleteDialog(true)}
          onExport={handleExport}
        />
      </div>
      <ListsTable
        globalFilter={query}
        setGlobalFilter={setQuery}
        lists={lists}
        onRowsFetched={setExportData}
        setSelection={setSelectedLists}
      />
      <ListDeleteDialog
        lists={selectedLists}
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
      />
    </div>
  )
}

export default ListsPage
