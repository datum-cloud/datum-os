import React from 'react'
import { ChevronsUpDown } from 'lucide-react'
import { Column } from '@tanstack/react-table'

import { cn } from '../../lib/utils'
import { tableStyles } from '../table/table.styles'

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  children?: string | React.ReactNode
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  children,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const { tableHeader } = tableStyles()
  if (!column.getCanSort()) {
    return <div className={cn(tableHeader(), className)}>{children}</div>
  }

  return (
    <button
      type="button"
      className={cn(tableHeader(), className)}
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      <span className="inline-block pb-[2px]">{children}</span>
      <ChevronsUpDown size={16} />
    </button>
  )
}
