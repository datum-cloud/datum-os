'use client'

import { EyeIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  FilterFn,
  SortingFn,
  sortingFns,
  RowData,
} from '@tanstack/react-table'
import {
  RankingInfo,
  rankItem,
  compareItems,
} from '@tanstack/match-sorter-utils'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../table/table'
import { Button } from '../button/button'
import { Input } from '../input/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../dropdown-menu/dropdown-menu'
import { DataTableColumnHeader } from './data-column-header'
import { DataTablePagination } from './data-table-pagination'
import { cn } from '../../lib/utils'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  bordered?: boolean
  layoutFixed?: boolean
  highlightHeader?: boolean
  showFilter?: boolean
  showFooter?: boolean
  showVisibility?: boolean
  noResultsText?: string
  filterFns?: Record<string, FilterFn<any>>
  globalFilterFn?: any
  globalFilter?: string
  columnFilters?: ColumnFiltersState
  setGlobalFilter?(input: string): void
  onSelectionChange?(selection: TData[]): void
}

declare module '@tanstack/react-table' {
  //add fuzzy filter to the filterFns
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }

  interface ColumnMeta<TData extends RowData, TValue> {
    pin?: 'left' | 'right'
  }
}

export function DataTable<TData, TValue>({
  columns,
  data,
  layoutFixed,
  showFilter = false,
  showFooter = false,
  showVisibility = false,
  bordered = false,
  highlightHeader = false,
  noResultsText = 'No results',
  filterFns = {},
  globalFilterFn,
  globalFilter,
  columnFilters: _columnFilters = [],
  setGlobalFilter,
  onSelectionChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(_columnFilters)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    filterFns,
    globalFilterFn,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    defaultColumn: {
      size: 0,
    },
  })

  useEffect(() => {
    if (onSelectionChange) {
      const selectedRowData = Object.keys(rowSelection)
        .filter((id) => !!data[Number(id)]) // Filter out undefined
        .map((id) => data[Number(id)])
      onSelectionChange(selectedRowData as TData[])
    }
  }, [rowSelection])

  return (
    <>
      {(showFilter || showVisibility) && (
        <div className="flex items-center py-4">
          {showFilter && (
            <Input
              placeholder="Filter by name..."
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          )}
          {showVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="md" className="ml-auto">
                  <EyeIcon />
                  Visibility
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
      <Table layoutFixed={layoutFixed}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => {
                const columnWidth =
                  header.getSize() === 20 ? 'auto' : `${header.getSize()}px`

                const hasBorder =
                  bordered && headerGroup.headers.length - 1 > index
                return (
                  <TableHead
                    highlightHeader={highlightHeader}
                    bordered={hasBorder}
                    key={header.id}
                    style={{ width: columnWidth }}
                    className={cn(
                      header.getContext().column.columnDef.meta?.pin ===
                        'left' && 'sticky z-20 left-0',
                      header.getContext().column.columnDef.meta?.pin ===
                        'right' && 'sticky z-20 right-0',
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="group table-row"
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell, index) => {
                  const hasBorder =
                    bordered && row.getVisibleCells().length - 1 > index
                  const columnWidth =
                    cell.column.getSize() === 20
                      ? 'auto'
                      : `${cell.column.getSize()}px`

                  return (
                    <TableCell
                      bordered={hasBorder}
                      key={cell.id}
                      style={{ width: columnWidth }}
                      className={cn(
                        cell.getContext().column.columnDef.meta?.pin ===
                          'left' &&
                          'sticky z-20 bg-inherit left-0 bg-white group-hover:bg-blackberry-900',
                        cell.getContext().column.columnDef.meta?.pin ===
                          'right' &&
                          'sticky z-20 bg-inherit right-0 bg-white group-hover:bg-blackberry-50',
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {noResultsText}
              </TableCell>
            </TableRow>
          )}
          {showFooter && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length}>
                <DataTablePagination table={table} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        {/* <TableFooter>
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center flex gap-2"
            >
              <Button
                variant="outline"
                size="md"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>
    </>
  )
}

export {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type FilterFn,
  type SortingFn,
  type RankingInfo,
  DataTableColumnHeader,
  DataTablePagination,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  rankItem,
  compareItems,
  sortingFns,
}
