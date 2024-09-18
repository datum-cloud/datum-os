'use client'

import Link from 'next/link'

import { getPathWithParams } from '@repo/common/routes'
import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { Checkbox } from '@repo/ui/checkbox'
import {
  ColumnDef,
  DataTable,
  DataTableColumnHeader,
  ColumnFiltersState,
} from '@repo/ui/data-table'
import { Tag } from '@repo/ui/tag'
import type { Datum } from '@repo/types'

import { formatDate } from '@/utils/date'

import ContactsTableDropdown from '../contacts/contacts-table-dropdown'
import { tableStyles } from '../contacts/page.styles'

type ListContactsTableProps = {
  contacts: Datum.Contact[]
  onSelectionChange(contacts: Datum.Contact[]): void
  globalFilter?: string
  columnFilters?: ColumnFiltersState
  setGlobalFilter?(input: string): void
}

const { header, checkboxContainer, link } = tableStyles()

export const LIST_CONTACT_COLUMNS: ColumnDef<Datum.Contact>[] = [
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
    enableGlobalFilter: true,
    enableSorting: true,
    meta: {
      minWidth: 185,
    },
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
    enableGlobalFilter: true,
    enableSorting: true,
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

const ListContactsTable = ({
  contacts,
  onSelectionChange,
}: ListContactsTableProps) => {
  return (
    <DataTable
      columns={LIST_CONTACT_COLUMNS}
      data={contacts}
      layoutFixed
      bordered
      onSelectionChange={onSelectionChange}
      highlightHeader
      showFooter
    />
  )
}

export default ListContactsTable
