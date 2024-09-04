import { Column } from '@tanstack/react-table'

import { cn } from '../../lib/utils'
import { Button } from '../button/button'
import { ChevronsUpDown } from 'lucide-react'

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
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{children}</div>
  }

  return (
    <Button
      variant="blackberryGhost"
      size="content"
      className={cn(className)}
      icon={<ChevronsUpDown />}
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {children}
    </Button>
  )
}
