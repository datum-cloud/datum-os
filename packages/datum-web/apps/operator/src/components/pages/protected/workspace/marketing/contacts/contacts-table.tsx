'use client'

import { format } from 'date-fns'
import { useState, useEffect } from 'react'
import { ColumnDef } from '@tanstack/react-table'

import { Checkbox } from '@repo/ui/checkbox'
import { DataTable } from '@repo/ui/data-table'
import { cn } from '@repo/ui/lib/utils'
import { Datum } from '@repo/types'

import ContactDropdownMenu from './contact-dropdown'

import { tagStyles } from './table.styles'

type ContactsTableProps = {
  contacts: Datum.Contact[]
}

type SelectionState = Record<Datum.ContactId, boolean>

export const ContactsTable = ({ contacts }: ContactsTableProps) => {
  const [selectedContacts, setSelectedContacts] = useState<SelectionState>({})
  const [filteredContacts, setFilteredContacts] =
    useState<Datum.Contact[]>(contacts)
  const allSelected = !filteredContacts.some(({ id }) => !selectedContacts[id])

  useEffect(() => {
    if (contacts) {
      setFilteredContacts(contacts)
    }
  }, [contacts])

  useEffect(() => {
    setSelectedContacts({})
  }, [filteredContacts])

  function toggleSelect(id: Datum.ContactId) {
    const newContacts = { ...selectedContacts }
    newContacts[id] = !Boolean(selectedContacts[id])

    setSelectedContacts(newContacts)
  }

  function toggleSelectAll() {
    const newContacts: SelectionState = {}

    if (!allSelected) {
      for (const { id } of filteredContacts) {
        newContacts[id] = true
      }
    }

    setSelectedContacts(newContacts)
  }

  const columns: ColumnDef<Datum.Contact>[] = [
    {
      id: 'select',
      accessorKey: 'id',
      header: () => {
        return (
          <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
        )
      },
      cell: ({ cell }) => {
        const id = cell.getValue() as Datum.ContactId

        return (
          <Checkbox
            value={id}
            checked={selectedContacts[id]}
            onCheckedChange={() => toggleSelect(id)}
          />
        )
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
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
        const value = cell.getValue() as string
        const date = format(new Date(value), `MMMM d, yyyy 'at' h:mm`)
        const amPm = format(value, 'a').toLowerCase()

        return `${date}${amPm}`
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
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
      header: 'Lists',
      cell: ({ cell }) => {
        const lists = cell.getValue() as string[]
        const [first, ...rest] = lists

        return (
          <div className="text-nowrap">
            <span className={cn(tagStyles({ status: 'default' }), 'mr-[9px]')}>
              {first}
            </span>
            {rest.length > 0 && (
              <span className={tagStyles({ status: 'default' })}>
                + {rest.length}
              </span>
            )}
          </div>
        )
      },
    },
    {
      header: '',
      accessorKey: 'id',
      cell: ({ cell }) => {
        const id = cell.getValue() as Datum.ContactId

        return <ContactDropdownMenu id={id} />
      },
    },
  ]

  return <DataTable columns={columns} data={filteredContacts} />
}
