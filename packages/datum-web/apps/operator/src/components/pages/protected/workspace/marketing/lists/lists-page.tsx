'use client'

import { useSession } from 'next-auth/react'
import React, { useState } from 'react'

import { ColumnFiltersState } from '@repo/ui/data-table'
import type { Datum } from '@repo/types'

import PageTitle from '@/components/page-title'
import ListsControls from '@/components/pages/protected/workspace/marketing/lists/lists-controls'
import { useLists } from '@/hooks/useLists'

import ListsTable from './lists-table'
import { pageStyles } from './page.styles'
import ListDeleteDialog from '@/components/pages/protected/workspace/marketing/list/list-delete-dialog'

const ListsPage = () => {
  const [selectedLists, setSelectedLists] = useState<Datum.List[]>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [openDeleteDialog, _setOpenDeleteDialog] = useState(false)
  const [query, setQuery] = useState('')
  const { data: session } = useSession()
  const organizationId =
    session?.user.organization ?? ('' as Datum.OrganisationId)
  const { data: lists = [], error, isLoading } = useLists(organizationId)
  const { wrapper, header } = pageStyles()

  function handleExport() {
    // TODO:Export files
    console.log('Export Selected Files')
  }

  async function setOpenDeleteDialog(input: boolean) {
    _setOpenDeleteDialog(input)
    // NOTE: This is needed to close the dialog without removing pointer events per https://github.com/shadcn-ui/ui/issues/468
    setTimeout(() => (document.body.style.pointerEvents = ''), 500)
  }

  return (
    <div className={wrapper()}>
      <div className={header()}>
        <PageTitle title="Lists" />
        <ListsControls
          onDelete={() => setOpenDeleteDialog(true)}
          onExport={handleExport}
        />
      </div>
      {!error && !isLoading && (
        <ListsTable
          globalFilter={query}
          setGlobalFilter={setQuery}
          columnFilters={columnFilters}
          lists={lists}
          setSelection={setSelectedLists}
        />
      )}
      <ListDeleteDialog
        ids={selectedLists.map(({ id }) => id)}
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
      />
    </div>
  )
}

export default ListsPage
