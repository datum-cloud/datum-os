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
  Row,
} from '@repo/ui/data-table'
import { Tag } from '@repo/ui/tag'
import type { Datum } from '@repo/types'

import ListContactsTableDropdown from '@/components/pages/protected/workspace/marketing/list/list-contact-table-dropdown'
import { formatDate } from '@/utils/date'

import { tableStyles } from '../contacts/page.styles'

type ListContactsTableProps = {
  id: Datum.ListId
  contacts: Datum.Contact[]
  setSelection(contacts: Datum.Contact[]): void
  isDialog?: boolean
  globalFilter?: string
  columnFilters?: ColumnFiltersState
  setGlobalFilter?(input: string): void
  onRowsFetched?(data: Row<Datum.Contact>[]): void
}

const { header, checkboxContainer, link } = tableStyles()

function generateColumns(
  listId: Datum.ListId,
  isDialog: boolean,
): ColumnDef<Datum.Contact>[] {
  const otherColumns: ColumnDef<Datum.Contact>[] = !isDialog
    ? [
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

            return (
              <ListContactsTableDropdown listId={listId} contact={contact} />
            )
          },
        },
      ]
    : []

  return [
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
        minWidth: 200,
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
        minWidth: 180,
      },
    },
    ...otherColumns,
  ]
}

const ListContactsTable = ({
  id,
  contacts,
  setSelection,
  isDialog = false,
  globalFilter,
  columnFilters,
  onRowsFetched,
  setGlobalFilter,
}: ListContactsTableProps) => {
  const columns = generateColumns(id, isDialog)

  return (
    <DataTable
      columns={columns}
      data={contacts}
      layoutFixed
      bordered
      setSelection={setSelection}
      highlightHeader
      showFooter
      globalFilter={globalFilter}
      globalFilterFn="includesString"
      columnFilters={columnFilters}
      setGlobalFilter={setGlobalFilter}
      onRowsFetched={onRowsFetched}
    />
  )
}

export default ListContactsTable
