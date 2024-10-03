'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

import { getPathWithParams } from '@repo/common/routes'
import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/avatar'
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
  ColumnFiltersState,
  Row,
} from '@repo/ui/data-table'
import { Tag, TagVariants } from '@repo/ui/tag'
import { Datum } from '@repo/types'

import { formatDate } from '@/utils/date'

import { tableStyles } from './page.styles'

type UsersTableProps = {
  users: Datum.OrgUser[]
  setSelection?(users: Datum.OrgUser[]): void
  globalFilter?: string
  columnFilters?: ColumnFiltersState
  setGlobalFilter?(input: string): void
  onRowsFetched?(data: Row<Datum.OrgUser>[]): void
}

const { header, checkboxContainer, link, userDetails, userDetailsText } =
  tableStyles()

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

const booleanFilter: FilterFn<any> = (row, columnId, value) => {
  let cellValue = row.getValue(columnId)

  if (typeof cellValue === 'string') {
    cellValue = cellValue.trim()
  }

  return Boolean(cellValue) === value
}

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId].itemRank!,
      rowB.columnFiltersMeta[columnId].itemRank!
    )
  }

  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

const filterFns = {
  fuzzy: fuzzyFilter,
  boolean: booleanFilter,
}

export const USER_COLUMNS: ColumnDef<Datum.OrgUser>[] = [
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
    cell: ({ row, table }) => {
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
    accessorFn: (row) =>
      `${row?.firstName ?? ''}${row?.lastName ? row?.lastName : ''}`,
    enableGlobalFilter: true,
    filterFn: booleanFilter,
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
    id: 'email',
    accessorFn: (row) => row?.email || '',
    enableGlobalFilter: true,
    filterFn: booleanFilter,
    enableSorting: true,
    sortingFn: fuzzySort,
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
        column={column}
        children="Email"
      />
    ),
    meta: {
      minWidth: 212,
    },
    cell: ({ cell, row }) => {
      const value = cell.getValue() as Datum.Email

      return (
        <Link
          href={getPathWithParams(OPERATOR_APP_ROUTES.user, {
            id: row.original?.id,
          })}
          className={link()}
          rel="noopener noreferrer"
        >
          {value}
        </Link>
      )
    },
  },
  {
    id: 'provider',
    accessorFn: (row) => row?.authProvider || '',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
        column={column}
        children="Provider"
      />
    ),
    filterFn: booleanFilter,
    enableGlobalFilter: false,
    enableSorting: true,
    sortingFn: fuzzySort,
    meta: {
      minWidth: 192,
    },
  },
  {
    id: 'role',
    accessorFn: (row) => row?.orgRole || '',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
        column={column}
        children="Role"
      />
    ),
    enableGlobalFilter: false,
    enableSorting: true,
    meta: {
      minWidth: 150,
    },
  },
  {
    id: 'status',
    accessorFn: (row) => row?.setting?.status,
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
        column={column}
        children="Status"
      />
    ),
    filterFn: booleanFilter,
    enableGlobalFilter: true,
    enableSorting: true,
    sortingFn: fuzzySort,
    cell: ({ cell }) => {
      const status = cell.getValue() as string

      let variant: TagVariants['status'] = 'default'

      if (status === 'ACTIVE') variant = 'success'
      if (status === 'SUSPENDED') variant = 'destructive'

      return <Tag variant={variant}>{status ?? 'N/A'}</Tag>
    },
    meta: {
      minWidth: 132,
    },
  },
  {
    id: 'lastSeen',
    accessorFn: (row) => row?.lastSeen || '',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
        column={column}
        children="Last Login"
      />
    ),
    enableGlobalFilter: false,
    enableSorting: true,
    sortingFn: fuzzySort,
    cell: ({ row }) => {
      const value = row.original as Datum.OrgUser

      const lastLogin = value?.lastSeen || ''
      const formattedDate = formatDate(new Date(lastLogin))

      return <>{formattedDate}</>
    },
    meta: {
      minWidth: 220,
    },
  },
]

const UsersTable = ({
  users,
  globalFilter,
  columnFilters,
  setGlobalFilter,
  setSelection,
  onRowsFetched,
}: UsersTableProps) => {
  const [filteredUsers, setFilteredUsers] = useState<Datum.OrgUser[]>(users)

  useEffect(() => {
    if (users) {
      setFilteredUsers(users)
    }
  }, [users])

  return (
    <DataTable
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      filterFns={filterFns}
      globalFilterFn="fuzzy"
      columnFilters={columnFilters}
      columns={USER_COLUMNS}
      data={filteredUsers}
      layoutFixed
      bordered
      setSelection={setSelection}
      highlightHeader
      showFooter
      onRowsFetched={onRowsFetched}
    />
  )
}

export default UsersTable
