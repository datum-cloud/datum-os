'use client'

import { useState, useEffect } from 'react'

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
} from '@repo/ui/data-table'
import { Datum } from '@repo/types'

import { formatDate } from '@/utils/date'
import { sortAlphabetically } from '@/utils/sort'

import ContactsTableDropdown from './contacts-table-dropdown'
import { tableStyles } from './page.styles'
import Link from 'next/link'
import { getPathWithParams } from '@repo/common/routes'
import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { Tag } from '@repo/ui/tag'

type ContactsTableProps = {
  contacts: Datum.Contact[]
  globalFilter: string
  columnFilters?: ColumnFiltersState
  setGlobalFilter(input: string): void
  onSelectionChange(contacts: Datum.Contact[]): void
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

const emptyFilter: FilterFn<any> = (row, columnId, value) => Boolean(value)

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!,
    )
  }

  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

const filterFns = {
  fuzzy: fuzzyFilter,
  empty: emptyFilter,
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
    minSize: 225,
    enableGlobalFilter: true,
    sortingFn: fuzzySort,
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
        column={column}
        children="Email"
      />
    ),
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
    minSize: 185,
    enableGlobalFilter: true,
    enableSorting: true,
    sortingFn: fuzzySort,
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
    size: 225,
    enableGlobalFilter: true,
    enableSorting: true,
    sortingFn: fuzzySort,
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
    size: 120,
    enableGlobalFilter: true,
    enableSorting: true,
    cell: ({ cell }) => {
      const value = cell.getValue() as Datum.Status
      const isActive = value === 'ACTIVE'

      return <Tag variant={isActive ? 'success' : 'default'}>{value}</Tag>
    },
  },
  {
    id: 'lists',
    accessorKey: 'lists',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
        column={column}
        children="Lists"
      />
    ),
    minSize: 165,
    enableGlobalFilter: false,
    enableSorting: false,
    cell: ({ cell }) => {
      const lists = cell.getValue() as string[]
      const sortedLists = lists.sort(sortAlphabetically)
      const [first, ...rest] = sortedLists

      return (
        <div className="text-nowrap">
          <Tag className="mr-[9px]">{first}</Tag>
          {rest.length > 0 && <Tag variant="muted">+ {rest.length}</Tag>}
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
  onSelectionChange,
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
      onSelectionChange={onSelectionChange}
      highlightHeader
      showFooter
    />
  )
}

export default ContactsTable
