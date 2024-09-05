import * as React from 'react'
import { cn } from '../../lib/utils'
import { tableStyles } from './table.styles'

const {
  container,
  table,
  tableHeader,
  tableBody,
  tableFooter,
  tableRow,
  tableHead,
  tableCell,
  tableCaption,
} = tableStyles()

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  bordered?: boolean
  highlightHeader?: boolean
}
interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  bordered?: boolean
}

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  layoutFixed?: boolean
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, layoutFixed, ...props }, ref) => (
    <div className={cn(container())}>
      <table
        ref={ref}
        className={cn(table(), className)}
        style={layoutFixed ? { tableLayout: 'fixed' } : {}}
        {...props}
      />
    </div>
  ),
)
Table.displayName = 'Table'

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn(tableHeader(), className)} {...props} />
))
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn(tableBody(), className)} {...props} />
))
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot ref={ref} className={cn(tableFooter(), className)} {...props} />
))
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn(tableRow(), className)} {...props} />
))
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, bordered, highlightHeader, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(tableHead({ bordered, highlightHeader }), className)}
      {...props}
    />
  ),
)
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, bordered, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(tableCell({ bordered }), className)}
      {...props}
    />
  ),
)
TableCell.displayName = 'TableCell'

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn(tableCaption(), className)} {...props} />
))
TableCaption.displayName = 'TableCaption'

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
