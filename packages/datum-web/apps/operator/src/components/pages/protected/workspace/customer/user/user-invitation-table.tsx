'use client'

import {
  ColumnDef,
  DataTable,
  DataTableColumnHeader,
  ColumnFiltersState,
  Row,
} from '@repo/ui/data-table'
import { Tag } from '@repo/ui/tag'
import type { Datum } from '@repo/types'

import { formatDate } from '@/utils/date'

import UserInvitationTableDropdown from './user-invitation-table-dropdown'
import { tableStyles } from './page.styles'
import { Checkbox } from '@repo/ui/checkbox'

type UserInvitationTableProps = {
  invitations: Datum.Invitation[]
  setSelection(invitations: Datum.Invitation[]): void
  globalFilter?: string
  columnFilters?: ColumnFiltersState
  setGlobalFilter?(input: string): void
  onRowsFetched?(data: Row<Datum.Invitation>[]): void
}

const { header, checkboxContainer } = tableStyles()

const INVITATION_COLUMNS: ColumnDef<Datum.Invitation>[] = [
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
            aria-label="Select all invitations"
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
            aria-label="Select invitation"
          />
        </div>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
        column={column}
        children="Sent"
      />
    ),
    cell: ({ cell }) => {
      const value = cell.getValue() as string
      const formattedDate = formatDate(new Date(value))

      return formattedDate
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
        column={column}
        children="Status"
      />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue() as string
      return <Tag>{status}</Tag>
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
        column={column}
        children="Role"
      />
    ),
  },
  {
    accessorKey: 'id',
    header: '',
    cell: ({ cell }) => {
      const invitationId = cell.getValue() as Datum.InvitationId

      return <UserInvitationTableDropdown invitationId={invitationId} />
    },
    enableColumnFilter: false,
    enableSorting: false,
    enableGlobalFilter: false,
    size: 60,
    meta: {
      pin: 'right',
    },
  },
]

const UserInvitationTable = ({
  invitations,
  globalFilter,
  columnFilters,
  setSelection,
  onRowsFetched,
  setGlobalFilter,
}: UserInvitationTableProps) => {
  return (
    <DataTable
      columns={INVITATION_COLUMNS}
      data={invitations}
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

export default UserInvitationTable
