'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

import { getPathWithParams } from '@repo/common/routes'
import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { Checkbox } from '@repo/ui/checkbox'
import {
  ColumnDef,
  FilterFn,
  SortingFn,
  DataTable,
  DataTableColumnHeader,
  sortingFns,
  rankItem,
  compareItems,
  ColumnFiltersState,
  Row,
} from '@repo/ui/data-table'
import { Tag } from '@repo/ui/tag'
import { Datum } from '@repo/types'

import { formatDate } from '@/utils/date'
import { sortAlphabetically } from '@/utils/sort'

import ContactsTableDropdown from './contacts-table-dropdown'
import { tableStyles } from './page.styles'

type ContactsTableProps = {
  contacts: Datum.Contact[]
  setSelection(contacts: Datum.Contact[]): void
  globalFilter?: string
  columnFilters?: ColumnFiltersState
  setGlobalFilter?(input: string): void
  setExportData?(data: Row<Datum.Contact>[]): void
}

const { header, checkboxContainer, link } = tableStyles()

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  if (!value || value === '') return true

  const cellValue = row.getValue(columnId)

  if (!cellValue) return false

  const itemRank = rankItem(cellValue, value)

  addMeta({
    itemRank,
  })

  return itemRank.passed
}

const booleanFilter: FilterFn<any> = (row, columnId, value) => {
  let cellValue = row.getValue(columnId)

  if (typeof cellValue === 'string') {
    cellValue = cellValue.trim()
  }

  return Boolean(cellValue) === value
}

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  if (!rowA.columnFiltersMeta[columnId] && !rowB.columnFiltersMeta[columnId]) {
    return 0
  }

  if (!rowA.columnFiltersMeta[columnId]) {
    return -1
  }

  if (!rowB.columnFiltersMeta[columnId]) {
    return 1
  }

  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId].itemRank!,
      rowB.columnFiltersMeta[columnId].itemRank!,
    )
  }

  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

const filterFns = {
  fuzzy: fuzzyFilter,
  boolean: booleanFilter,
}

export const CONTACT_COLUMNS: ColumnDef<Datum.Contact>[] = [
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
            aria-label="Select all contacts"
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
            aria-label="Select contact"
          />
        </div>
      )
    },
  },
  {
    id: 'email',
    accessorFn: (row) => row.email || '',
    enableGlobalFilter: true,
    filterFn: booleanFilter,
    enableSorting: true,
    sortingFn: fuzzySort,
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
        column={column}
        children="Email"
      />
    ),
    meta: {
      minWidth: 225,
    },
    cell: ({ cell, row }) => {
      const value = cell.getValue() as Datum.Email
      const id = row.original.id

      return (
        <Link
          href={getPathWithParams(OPERATOR_APP_ROUTES.contact, { id })}
          className={link()}
          rel="noopener noreferrer"
        >
          {value}
        </Link>
      )
    },
  },
  {
    id: 'fullName',
    accessorKey: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
        column={column}
        children="Name"
      />
    ),
    filterFn: booleanFilter,
    enableGlobalFilter: true,
    enableSorting: true,
    sortingFn: fuzzySort,
    meta: {
      minWidth: 185,
    },
  },
  // NOTE: Removing temporarily per Chris' request
  // {
  //   id: 'source',
  //   accessorKey: 'source',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader
  //       className={header()}
  //       column={column}
  //       children="Source"
  //     />
  //   ),
  //   minSize: 140,
  //   enableGlobalFilter: true,
  //   enableSorting: true,
  //   sortingFn: fuzzySort,
  // },
  {
    id: 'createdAt',
    accessorFn: (row) => formatDate(row.createdAt),
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
        column={column}
        children="Created At"
      />
    ),
    enableGlobalFilter: true,
    enableSorting: true,
    sortingFn: fuzzySort,
    meta: {
      minWidth: 225,
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
        column={column}
        children="Status"
      />
    ),
    enableGlobalFilter: true,
    enableSorting: true,
    sortingFn: fuzzySort,
    cell: ({ cell }) => {
      const value = cell.getValue() as Datum.Status
      const isActive = value === 'ACTIVE'

      return <Tag variant={isActive ? 'success' : 'default'}>{value}</Tag>
    },
    meta: {
      minWidth: 120,
    },
  },
  {
    id: 'lists',
    accessorKey: 'contactLists',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
        column={column}
        children="Lists"
      />
    ),
    enableGlobalFilter: false,
    enableSorting: false,
    cell: ({ cell }) => {
      const lists = cell.getValue() as Datum.List[]
      const sortedLists = lists.sort((a, b) =>
        sortAlphabetically(a.name, b.name),
      )
      const [first, ...rest] = sortedLists

      return (
        <div className="text-nowrap">
          <Tag className="mr-[9px]">{first?.name || 'N/A'}</Tag>
          {rest.length > 0 && <Tag variant="muted">+ {rest.length}</Tag>}
        </div>
      )
    },
    meta: {
      minWidth: 165,
    },
  },
  {
    id: 'dropdown',
    accessorKey: 'id',
    size: 60,
    enableGlobalFilter: false,
    enableSorting: false,
    header: '',
    meta: {
      pin: 'right',
    },
    cell: ({ row }) => {
      const contact = row.original

      return <ContactsTableDropdown contact={contact} />
    },
  },
]

const ContactsTable = ({
  contacts,
  globalFilter,
  columnFilters,
  setGlobalFilter,
  setSelection,
  setExportData,
}: ContactsTableProps) => {
  const [filteredContacts, setFilteredContacts] =
    useState<Datum.Contact[]>(contacts)

  useEffect(() => {
    if (contacts) {
      setFilteredContacts(contacts)
    }
  }, [contacts])

  return (
    <DataTable
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      filterFns={filterFns}
      globalFilterFn="fuzzy"
      columnFilters={columnFilters}
      columns={CONTACT_COLUMNS}
      data={filteredContacts}
      layoutFixed
      bordered
      setSelection={setSelection}
      highlightHeader
      setExportData={setExportData}
      showFooter
    />
  )
}

export default ContactsTable
