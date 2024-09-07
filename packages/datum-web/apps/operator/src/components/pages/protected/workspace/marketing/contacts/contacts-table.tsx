'use client'

import { format } from 'date-fns'
import { useState, useEffect } from 'react'
import { ColumnDef } from '@tanstack/react-table'

import { Checkbox } from '@repo/ui/checkbox'
import { DataTable } from '@repo/ui/data-table'
import { DataTableColumnHeader } from '@repo/ui/data-column-header'
import { Datum } from '@repo/types'
import { cn } from '@repo/ui/lib/utils'

import ContactDropdownMenu from './contact-dropdown'

import { headerStyles, tagStyles } from './table.styles'

type ContactsTableProps = {
  contacts: Datum.Contact[]
}

export const CONTACT_COLUMNS: ColumnDef<Datum.Contact>[] = [
  {
    id: 'select',
    accessorKey: 'id',
    size: 60,
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
    accessorKey: 'email',
    minSize: 225,
    enableSorting: true,
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
    accessorKey: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={headerStyles()}
        column={column}
        children="Name"
      />
    ),
    minSize: 185,
    enableSorting: true,
  },
  {
    accessorKey: 'source',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={headerStyles()}
        column={column}
        children="Source"
      />
    ),
    minSize: 140,
    enableSorting: true,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={headerStyles()}
        column={column}
        children="Created At"
      />
    ),
    size: 225,
    enableSorting: true,
    cell: ({ cell }) => {
      const value = cell.getValue() as string
      const date = format(new Date(value), `MMMM d, yyyy 'at' h:mm`)
      const amPm = format(value, 'a').toLowerCase()

      return <div className="w-full">{`${date}${amPm}`}</div>
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={headerStyles()}
        column={column}
        children="Status"
      />
    ),
    size: 120,
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
    accessorKey: 'lists',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={headerStyles()}
        column={column}
        children="Lists"
      />
    ),
    minSize: 165,
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
    accessorKey: 'id',
    minSize: 80,
    header: '',
    cell: ({ cell }) => {
      const id = cell.getValue() as Datum.ContactId

      return <ContactDropdownMenu id={id} />
    },
  },
]

export const ContactsTable = ({ contacts }: ContactsTableProps) => {
  const [filteredContacts, setFilteredContacts] =
    useState<Datum.Contact[]>(contacts)

  useEffect(() => {
    if (contacts) {
      setFilteredContacts(contacts)
    }
  }, [contacts])

  return (
    <DataTable
      bordered
      highlightHeader
      layoutFixed
      columns={CONTACT_COLUMNS}
      data={filteredContacts}
      showFooter
    />
  )
}
