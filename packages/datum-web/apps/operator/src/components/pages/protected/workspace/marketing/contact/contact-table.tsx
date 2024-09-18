'use client'

import {
  ColumnDef,
  DataTable,
  DataTableColumnHeader,
} from '@repo/ui/data-table'

import { tableStyles } from '../contacts/page.styles'
import { LucideProps, MailOpen, Send } from 'lucide-react'
import { ForwardRefExoticComponent, RefAttributes } from 'react'
import { formatDate } from '@/utils/date'
import { Datum } from '@repo/types'

type ContactTableProps = {
  history: Datum.ContactHistoryEvent[]
}

const { header, checkboxContainer, link } = tableStyles()

type Event = {
  text: string
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >
}

const EVENT_MAP: Record<string, Event> = {
  opened: {
    text: 'Opened email',
    icon: MailOpen,
  },
  delivered: { text: 'Delivered email', icon: Send },
  sent: { text: 'Sent email', icon: Send },
}

export const CONTACT_COLUMNS: ColumnDef<Datum.ContactHistoryEvent>[] = [
  {
    id: 'event',
    accessorKey: 'type',
    minSize: 280,
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
        column={column}
        children="Event"
      />
    ),
    cell: ({ cell }) => {
      const value = cell.getValue() as string
      const event = EVENT_MAP?.[value]
      const { text, icon: Icon } = event

      return (
        <div className="flex items-center justify-start gap-5">
          <Icon size={18} className="text-sunglow-900" />
          {text}
        </div>
      )
    },
  },
  {
    id: 'content',
    accessorKey: 'content',
    minSize: 250,
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
        column={column}
        children="Content"
      />
    ),
  },
  {
    id: 'location',
    accessorKey: 'location',
    minSize: 230,
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
        column={column}
        children="Location"
      />
    ),
  },
  {
    id: 'date',
    accessorFn: (row) => formatDate(row.date),
    minSize: 260,
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
        column={column}
        children="Date & Time"
      />
    ),
  },
]

const ContactTable = ({ history }: ContactTableProps) => {
  return (
    <DataTable
      columns={CONTACT_COLUMNS}
      data={history}
      layoutFixed
      bordered
      highlightHeader
      showFooter
    />
  )
}

export default ContactTable
