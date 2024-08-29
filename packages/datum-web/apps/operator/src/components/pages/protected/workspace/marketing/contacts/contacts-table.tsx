'use client'

import {
  GetOrganizationMembersQuery,
  GetOrganizationMembersQueryVariables,
  useGetOrganizationMembersQuery,
} from '@repo/codegen/src/schema'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { DataTable } from '@repo/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'

type Contact = {
  fullName: string
  title: string
  company: string
  email: string
  status: string // TODO: enum
  address: string
  phoneNumber: string
  createdAt: Date // TODO: Check this...
}

type Member = NonNullable<
  NonNullable<GetOrganizationMembersQuery['organization']>['members']
>[number]

export const ContactsTable = () => {
  const { data: session } = useSession()
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])

  const variables: GetOrganizationMembersQueryVariables = {
    organizationId: session?.user.organization ?? '',
  }

  const [{ data, fetching, error }] = useGetOrganizationMembersQuery({
    variables,
    pause: !session,
  })

  useEffect(() => {
    if (data?.organization?.members) {
      //   setFilteredContacts(data.organization.members)
    }
  }, [data])

  if (error || fetching) return null

  const columns: ColumnDef<Contact>[] = [
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
