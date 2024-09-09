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
} from '@repo/ui/data-table'
import { cn } from '@repo/ui/lib/utils'
import { Datum } from '@repo/types'

import { formatDate } from '@/utils/date'

import ContactDropdownMenu from './contact-dropdown'
import { tableStyles } from './table.styles'
import { tagStyles } from './tag.styles'

type ContactsTableProps = {
  contacts: Datum.Contact[]
  globalFilter: string
  setGlobalFilter(input: string): void
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
    cell: ({ cell }) => {
      const value = cell.getValue() as Datum.Email

      return (
        <a
          href={`mailto:${value}`}
          className={link()}
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
  {
    id: 'source',
    accessorKey: 'source',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
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
    cell: ({ cell }) => (
      <div className="w-full">{cell.getValue() as string}</div>
    ),
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
