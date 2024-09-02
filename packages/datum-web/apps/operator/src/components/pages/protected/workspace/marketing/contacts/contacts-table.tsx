'use client'

import { format } from 'date-fns'
import { useState, useEffect } from 'react'
import { ColumnDef } from '@tanstack/react-table'

import { Checkbox } from '@repo/ui/checkbox'
import { DataTable } from '@repo/ui/data-table'
import { DataTableColumnHeader } from '@repo/ui/data-column-header'
import { cn } from '@repo/ui/lib/utils'
import { Datum } from '@repo/types'

import ContactDropdownMenu from './contact-dropdown'

import { headerStyles, tagStyles } from './table.styles'

type ContactsTableProps = {
  contacts: Datum.Contact[]
}

export const ContactsTable = ({ contacts }: ContactsTableProps) => {
  const [filteredContacts, setFilteredContacts] =
    useState<Datum.Contact[]>(contacts)

  useEffect(() => {
    if (contacts) {
      setFilteredContacts(contacts)
    }
  }, [contacts])

  const columns: ColumnDef<Datum.Contact>[] = [
    {
      id: 'select',
      accessorKey: 'id',
      size: 80,
      maxSize: 80,
      header: ({ table }) => {
        return (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            className="bg-white"
            aria-label="Select all contacts"
          />
        )
      },
      cell: ({ row }) => {
        return (
          <div className="pr-4">
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
      minSize: 185,
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
            className="text-sunglow-900 hover:underline"
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
      minSize: 165,
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
      size: 185,
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
        const value = cell.getValue() as string
        const isActive = value === 'Active'

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
      minSize: 50,
      header: '',
      cell: ({ cell }) => {
        const id = cell.getValue() as Datum.ContactId

        return <ContactDropdownMenu id={id} />
      },
    },
  ]

  return (
    <DataTable
      bordered
      highlightHeader
      columns={columns}
      data={filteredContacts}
      showFooter
    />
  )
}
