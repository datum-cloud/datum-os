'use client'

import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { KeyRoundIcon } from 'lucide-react'
import Image from 'next/image'

import { UserAuthProvider } from '@repo/codegen/src/schema'
import { Datum } from '@repo/types'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/avatar'
import { Checkbox } from '@repo/ui/checkbox'
import {
  ColumnFiltersState,
  DataTable,
  DataTableColumnHeader,
  Row,
} from '@repo/ui/data-table'

import { fuzzyFilter, fuzzySort } from '@/utils/filters/functions'

import MembersTableDropdown from './members-table-dropdown'
import { pageStyles } from './page.styles'

type MembersTableProps = {
  members: Datum.OrgUser[]
  isAdmin: boolean
  setSelection?(users: Datum.OrgUser[]): void
  globalFilter?: string
  columnFilters?: ColumnFiltersState
  setGlobalFilter?(input: string): void
  onRowsFetched?(data: Row<Datum.OrgUser>[]): void
  handleDelete(member: Datum.OrgUser[]): void
}

export const MembersTable = ({
  isAdmin,
  members,
  setSelection,
  globalFilter,
  columnFilters,
  setGlobalFilter,
  onRowsFetched,
  handleDelete,
}: MembersTableProps) => {
  const { checkboxContainer, userDetails, userDetailsText, header } =
    pageStyles()

  const filterFns = {
    fuzzy: fuzzyFilter,
  }

  const providerIcon = (provider: UserAuthProvider) => {
    switch (provider) {
      case UserAuthProvider.GOOGLE:
        return (
          <Image src="/icons/brand/google.svg" width={18} height={18} alt="" />
        )
      case UserAuthProvider.GITHUB:
        return (
          <Image src="/icons/brand/github.svg" width={18} height={18} alt="" />
        )
      default:
        return <KeyRoundIcon width={18} />
    }
  }

  const columns: ColumnDef<Datum.OrgUser>[] = [
    {
      id: 'select',
      accessorFn: (row) => row.id,
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
              aria-label="Select all users"
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
              aria-label="Select user"
            />
          </div>
        )
      },
    },
    {
      id: 'user',
      accessorFn: (row) => {
        const { firstName, lastName, email } = row || {}

        return firstName || lastName
          ? `${firstName ?? ''}${lastName ? lastName : ''}`
          : email
      },
      enableGlobalFilter: true,
      enableSorting: true,
      sortingFn: fuzzySort,
      header: ({ column }) => (
        <DataTableColumnHeader
          className={header()}
          column={column}
          children="User"
        />
      ),
      meta: {
        minWidth: 236,
      },
      cell: ({ row }) => {
        const value = row.original as Datum.OrgUser
        const { firstName, lastName, avatarLocalFile, avatarRemoteURL } =
          value || {}
        const avatar = avatarLocalFile || avatarRemoteURL

        return (
          <div className={userDetails()}>
            <Avatar variant="small">
              {avatar && <AvatarImage src={avatar} />}
              <AvatarFallback>{firstName?.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <p className={userDetailsText()}>
              {firstName} {lastName}
            </p>
          </div>
        )
      },
    },
    {
      accessorKey: 'joinedAt',
      header: ({ column }) => (
        <DataTableColumnHeader
          className={header()}
          column={column}
          children="Joined"
        />
      ),
      meta: {
        minWidth: 250,
      },
      cell: ({ cell }) =>
        format(new Date(cell.getValue() as string), 'd MMM yyyy'),
    },
    {
      accessorKey: 'authProvider',
      header: ({ column }) => (
        <DataTableColumnHeader
          className={header()}
          column={column}
          children="Provider"
        />
      ),
      cell: ({ cell }) => (
        <>{providerIcon(cell.getValue() as UserAuthProvider)}</>
      ),
      meta: {
        minWidth: 150,
      },
    },
    {
      accessorKey: 'orgRole',
      header: ({ column }) => (
        <DataTableColumnHeader
          className={header()}
          column={column}
          children="Role"
        />
      ),
      meta: {
        minWidth: 120,
      },
      cell: ({ cell }) => <>{cell.getValue()}</>,
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
        const member = row.original

        return (
          <MembersTableDropdown
            isAdmin={isAdmin}
            member={member}
            handleDelete={handleDelete}
          />
        )
      },
    },
  ]

  return (
    <DataTable
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      filterFns={filterFns}
      globalFilterFn="fuzzy"
      columnFilters={columnFilters}
      columns={columns}
      data={members}
      layoutFixed
      bordered
      setSelection={setSelection}
      highlightHeader
      showFooter
      onRowsFetched={onRowsFetched}
    />
  )
}
