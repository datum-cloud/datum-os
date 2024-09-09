'use client'

import { format } from 'date-fns'
import { useState, useEffect } from 'react'
import {
  ColumnDef,
  FilterFn,
  SortingFn,
  sortingFns,
} from '@tanstack/react-table'
import { rankItem, compareItems } from '@tanstack/match-sorter-utils'

import { Checkbox } from '@repo/ui/checkbox'
import { DataTable } from '@repo/ui/data-table'
import { DataTableColumnHeader } from '@repo/ui/data-column-header'
import { Datum } from '@repo/types'
import { cn } from '@repo/ui/lib/utils'

import ContactDropdownMenu from './contact-dropdown'

import { headerStyles, tagStyles } from './table.styles'

type ContactsTableProps = {
  contacts: Datum.Contact[]
  globalFilter: string
  setGlobalFilter(input: string): void
}

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
}

export const CONTACT_COLUMNS: ColumnDef<Datum.Contact>[] = [
  {
    id: 'select',
    accessorKey: 'id',
    size: 60,
    enableGlobalFilter: false,
    enableSorting: false,
    header: ({ table }) => {
      return (
        <div className="flex items-center justify-center">
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
        <div className="flex items-center justify-center">
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
        className={headerStyles()}
        column={column}
        children="Email"
      />
    ),
    cell: ({ cell }) => {
      const value = cell.getValue() as Datum.Email

      return (
        <a
          href={`mailto:${value}`}
          className="block truncate text-sunglow-900 hover:underline"
          rel="noopener noreferrer"
        >
          {value}
        </a>
      )
    },
  },
  {
    id: 'fullName',
    accessorKey: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={headerStyles()}
        column={column}
        children="Name"
      />
    ),
    minSize: 185,
    enableGlobalFilter: true,
    enableSorting: true,
    sortingFn: fuzzySort,
  },
  {
    id: 'source',
    accessorKey: 'source',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={headerStyles()}
        column={column}
        children="Source"
      />
    ),
    minSize: 140,
    enableGlobalFilter: true,
    enableSorting: true,
    sortingFn: fuzzySort,
  },
  {
    id: 'createdAt',
    accessorFn: (row) => {
      const value = row.createdAt
      const date = format(new Date(value), `MMMM d, yyyy 'at' h:mm`)
      const amPm = format(value, 'a').toLowerCase()

      return `${date}${amPm}`
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        className={headerStyles()}
        column={column}
        children="Created At"
      />
    ),
    size: 225,
    enableGlobalFilter: true,
    enableSorting: true,
    sortingFn: fuzzySort,
    cell: ({ cell }) => (
      <div className="w-full">{cell.getValue() as string}</div>
    ),
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={headerStyles()}
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

      return (
        <span
          className={tagStyles({ status: isActive ? 'success' : 'default' })}
        >
          {value}
        </span>
      )
    },
  },
  {
    id: 'lists',
    accessorKey: 'lists',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={headerStyles()}
        column={column}
        children="Lists"
      />
    ),
    minSize: 165,
    enableGlobalFilter: false,
    enableSorting: false,
    cell: ({ cell }) => {
      const lists = cell.getValue() as string[]
      const [first, ...rest] = lists

      return (
        <div className="text-nowrap">
          <span className={cn(tagStyles({ status: 'default' }), 'mr-[9px]')}>
            {first}
          </span>
          {rest.length > 0 && (
            <span className={tagStyles({ status: 'muted' })}>
              + {rest.length}
            </span>
          )}
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
    cell: ({ cell }) => {
      const id = cell.getValue() as Datum.ContactId

      return <ContactDropdownMenu id={id} />
    },
  },
]

export const ContactsTable = ({
  contacts,
  globalFilter,
  setGlobalFilter,
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
      globalFilterFn="fuzzy"
      filterFns={filterFns}
      columns={CONTACT_COLUMNS}
      data={filteredContacts}
      layoutFixed
      bordered
      highlightHeader
      showFooter
    />
  )
}
