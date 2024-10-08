'use client'

import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { useSession } from 'next-auth/react'

import {
  InviteInviteStatus,
  InviteRole,
  useGetInvitesQuery,
} from '@repo/codegen/src/schema'
import { DataTable } from '@repo/ui/data-table'
import { Tag } from '@repo/ui/tag'

import { Loading } from '@/components/shared/loading/loading'

import { InvitesDropdown } from './invite-dropdown'

type InviteNode = {
  __typename?: 'Invite' | undefined
  id: string
  recipient: string
  status: InviteInviteStatus
  createdAt?: any
  role: InviteRole
}

type InviteEdge = {
  __typename?: 'InviteEdge' | undefined
  node?: InviteNode | null
}

const InviteTable = () => {
  const { data: session } = useSession()

  const [{ data, fetching, error }, refetch] = useGetInvitesQuery({
    pause: !session,
  })

  if (fetching) return <Loading />

  if (error || !data) return null

  const invites: InviteNode[] =
    data.invites.edges
      ?.filter(
        (edge): edge is InviteEdge => edge !== null && edge.node !== null,
      )
      .map((edge) => edge.node as InviteNode) || []

  const columns: ColumnDef<InviteNode>[] = [
    {
      accessorKey: 'recipient',
      header: 'Invited user',
    },
    {
      accessorKey: 'status',
      header: 'Status',
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
      header: 'Sent',
      cell: ({ cell }) =>
        format(new Date(cell.getValue() as string), 'd MMM yyyy'),
    },
    {
      accessorKey: 'role',
      header: 'Role',
    },
    {
      accessorKey: 'id',
      header: '',
      size: 60,
      cell: ({ cell }) => (
        <InvitesDropdown
          inviteId={cell.getValue() as string}
          refetchInvites={refetch}
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
