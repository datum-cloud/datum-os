'use client'

import { useSession } from 'next-auth/react'
import React, { useState } from 'react'

import { ColumnFiltersState } from '@repo/ui/data-table'
import type { Datum } from '@repo/types'

import PageTitle from '@/components/page-title'
import ListsControls from '@/components/pages/protected/workspace/marketing/lists/lists-controls'
import { useLists } from '@/hooks/useLists'
import { removeLists } from '@/query/lists'

import ListsTable from './lists-table'
import { pageStyles } from './page.styles'

const ListsPage = () => {
  const [selectedLists, setSelectedLists] = useState<Datum.List[]>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
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

  async function handleBatchDeletion() {
    await removeLists(
      organizationId,
      selectedLists.map(({ id }) => id),
    )

    setSelectedLists([])
  }

  return (
    <div className={wrapper()}>
      <div className={header()}>
        <PageTitle title="Lists" />
        <ListsControls onDelete={handleBatchDeletion} onExport={handleExport} />
      </div>
      {!error && !isLoading && (
        <ListsTable
          globalFilter={query}
          setGlobalFilter={setQuery}
          columnFilters={columnFilters}
          lists={lists}
          onSelectionChange={setSelectedLists}
        />
      )}
    </div>
  )
}

export default ListsPage
