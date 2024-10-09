'use client'

import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

import { InviteInviteStatus } from '@repo/codegen/src/schema'
import { Datum } from '@repo/types'
import { DataTable, DataTableColumnHeader } from '@repo/ui/data-table'
import { Tag } from '@repo/ui/tag'

import { InvitesDropdown } from './invite-dropdown'
import { pageStyles } from './page.styles'

type InviteTableProps = {
  invites: Datum.Invitation[]
  handleDelete(inviteIds: Datum.InvitationId[]): void
}

const InviteTable = ({ invites, handleDelete }: InviteTableProps) => {
  const { header } = pageStyles()
  const columns: ColumnDef<Datum.Invitation>[] = [
    {
      accessorKey: 'recipient',
      header: ({ column }) => (
        <DataTableColumnHeader
          className={header()}
          column={column}
          children="Invited user"
        />
      ),
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
        const status = cell.getValue() as InviteInviteStatus
        let statusLabel
        switch (status) {
          case InviteInviteStatus.APPROVAL_REQUIRED:
            statusLabel = 'Approval required'
            break
          case InviteInviteStatus.INVITATION_ACCEPTED:
            statusLabel = 'Accepted'
            break
          case InviteInviteStatus.INVITATION_EXPIRED:
            statusLabel = 'Expired'
            break
          case InviteInviteStatus.INVITATION_SENT:
            statusLabel = 'Outstanding'
            break
        }
        return <Tag>{statusLabel}</Tag>
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
      cell: ({ cell }) =>
        format(new Date(cell.getValue() as string), 'd MMM yyyy'),
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
      size: 60,
      cell: ({ cell }) => (
        <InvitesDropdown
          inviteId={cell.getValue() as Datum.InvitationId}
          handleDelete={handleDelete}
        />
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={invites}
      noResultsText="No invites found"
      globalFilterFn="fuzzy"
      layoutFixed
      bordered
      highlightHeader
      showFooter
    />
  )
}

export { InviteTable }
