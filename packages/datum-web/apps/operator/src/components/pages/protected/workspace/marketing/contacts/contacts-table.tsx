'use client'

import { useState, useEffect } from 'react'
import { DataTable } from '@repo/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Datum } from '@repo/types'

type ContactsTableProps = {
  contacts: Datum.Contact[]
}

export const ContactsTable = ({ contacts }: ContactsTableProps) => {
  const [filteredContacts, setFilteredContacts] = useState<Datum.Contact[]>(contacts)

  useEffect(() => {
    if (contacts) {
      setFilteredContacts(contacts)
    }
  }, [contacts])

  const columns: ColumnDef<Datum.Contact>[] = [
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'source',
      header: 'Source',
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
    {
      accessorKey: 'lists',
      header: 'Lists',
    },
  ]

  return <DataTable columns={columns} data={filteredContacts} />
}
