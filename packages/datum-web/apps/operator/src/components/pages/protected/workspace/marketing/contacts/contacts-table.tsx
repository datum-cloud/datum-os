'use client'

import { useState, useEffect } from 'react'
import { DataTable } from '@repo/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Datum } from '@repo/types'
import { cn } from '@repo/ui/lib/utils'

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
      accessorKey: 'email',
      header: 'Email',
      cell: ({ cell }) => {
        const value = cell.getValue()

        if (!Boolean(value) || typeof value !== 'string') return null

        return (
          <a href={`mailto:${value}`} rel="noopener noreferrer">
            {value}
          </a>
        )
      },
    },
    {
      accessorKey: 'fullName',
      header: 'Name',
    },
    {
      accessorKey: 'source',
      header: 'Source',
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ cell }) => {
        const value = cell.getValue()
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ cell }) => {
        const value = cell.getValue() as string
        const isActive = value === 'active'

        return (
          <span
            className={cn(
              'rounded-[5px] px-[7px] border uppercase font-semibold',
              isActive
                ? 'border-util-green-500 text-util-green-500'
                : 'border-blackberry-500 text-blackberry-500',
            )}
          >
            {value}
          </span>
        )
      },
    },
    {
      accessorKey: 'lists',
      header: 'Lists',
      cell: ({ cell }) => {
        const lists = cell.getValue() as string[]
        const firstList = lists.pop()

        if (!firstList) return null

        return (
          <div className="flex gap-2">
            <span className="rounded-[5px] px-[7px] border uppercase font-semibold border-blackberry-500 text-blackberry-500">
              {firstList}
            </span>
            {lists.length > 0 && (
              <span className="rounded-[5px] px-[7px] border uppercase font-semibold border-blackberry-500/50 text-blackberry-500">
                + {lists.length}
              </span>
            )}
          </div>
        )
      },
    },
  ]

  return <DataTable columns={columns} data={filteredContacts} />
}
