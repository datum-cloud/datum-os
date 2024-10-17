'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { getPathWithParams } from '@repo/common/routes'
import { OPERATOR_APP_ROUTES } from '@repo/constants'
import type { Datum } from '@repo/types'
import { Checkbox } from '@repo/ui/checkbox'
import {
  ColumnDef,
  ColumnFiltersState,
  DataTable,
  DataTableColumnHeader,
  Row,
} from '@repo/ui/data-table'
import { Tag } from '@repo/ui/tag'

import {
  booleanFilter,
  fuzzyFilter,
  fuzzySort,
} from '@/utils/filters/functions'

import ListsTableDropdown from './lists-table-dropdown'
import { tableStyles } from './page.styles'

type ListsTableProps = {
  lists: Datum.List[]
  globalFilter: string
  columnFilters?: ColumnFiltersState
  setGlobalFilter(input: string): void
  setSelection(lists: Datum.List[]): void
  onRowsFetched(lists: Row<Datum.List>[]): void
}

const { header, checkboxContainer, link } = tableStyles()

const filterFns = {
  fuzzy: fuzzyFilter,
  empty: booleanFilter,
}

export const LIST_COLUMNS: ColumnDef<Datum.List>[] = [
  {
    id: 'select',
    accessorKey: 'id',
    size: 60,
    enableGlobalFilter: false,
    enableSorting: false,
    meta: {
      pin: 'left',
    },
    header: ({ table }) => {
      return (
        <div className={checkboxContainer()}>
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            className="bg-white"
            aria-label="Select all lists"
          />
        </div>
      )
    },
    cell: ({ row }) => {
      return (
        <div className={checkboxContainer()}>
          <Checkbox
            checked={row.getIsSelected()}
            className="bg-white"
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select list"
          />
        </div>
      )
    },
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
        column={column}
        children="List Name"
      />
    ),
    minSize: 185,
    enableGlobalFilter: true,
    enableSorting: true,
    cell: ({ cell, row }) => (
      <Link
        href={getPathWithParams(OPERATOR_APP_ROUTES.contactList, {
          id: row.original.id,
        })}
        className="h-full inline-flex items-center justify-start"
      >
        <Tag variant="dark" truncate>
          {cell.getValue() as string}
        </Tag>
      </Link>
    ),
    sortingFn: fuzzySort,
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
        column={column}
        children="Description"
      />
    ),
    enableGlobalFilter: true,
    enableSorting: true,
    sortingFn: fuzzySort,
    meta: {
      minWidth: 308,
    },
  },
  {
    id: 'visibility',
    accessorKey: 'visibility',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
        column={column}
        children="Visibility"
      />
    ),
    minSize: 185,
    enableGlobalFilter: true,
    enableSorting: true,
    cell: ({ cell }) => {
      const value = cell.getValue() as string

      if (!value) return ''

      return (
        <Tag variant={value === 'public' ? 'public' : 'private'}>{value}</Tag>
      )
    },
    sortingFn: fuzzySort,
  },
  {
    id: 'members',
    accessorKey: 'memberCount',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
        column={column}
        children="Members"
      />
    ),
    minSize: 165,
    enableGlobalFilter: false,
    enableSorting: false,
    cell: ({ cell }) => {
      const count = cell.getValue() as number

      return (
        <div className="text-nowrap">
          <Tag className="mr-[9px]">{count}</Tag>
        </div>
      )
    },
  },
  {
    id: 'dropdown',
    accessorKey: 'id',
    minSize: 80,
    enableGlobalFilter: false,
    enableSorting: false,
    header: '',
    meta: {
      pin: 'right',
    },
    cell: ({ row }) => {
      const list = row.original

      return <ListsTableDropdown list={list} />
    },
  },
]

const ListsTable = ({
  lists,
  globalFilter,
  columnFilters,
  setGlobalFilter,
  setSelection,
  onRowsFetched,
}: ListsTableProps) => {
  const [filteredLists, setFilteredLists] = useState<Datum.List[]>(lists)

  useEffect(() => {
    if (lists) {
      setFilteredLists(lists)
    }
  }, [lists])

  return (
    <DataTable
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      filterFns={filterFns}
      globalFilterFn="fuzzy"
      columnFilters={columnFilters}
      columns={LIST_COLUMNS}
      data={filteredLists}
      layoutFixed
      bordered
      onRowsFetched={onRowsFetched}
      setSelection={setSelection}
      highlightHeader
      showFooter
    />
  )
}

export default ListsTable
