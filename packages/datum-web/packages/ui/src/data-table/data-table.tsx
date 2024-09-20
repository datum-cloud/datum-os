'use client'

import { EyeIcon } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
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
  Row,
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
  setExportData?(data: Row<TData>[]): void
  setGlobalFilter?(input: string): void
  setSelection?(selection: TData[]): void
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
    minWidth?: number
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
  setSelection,
  setExportData,
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
    setColumnFilters(_columnFilters)
  }, [_columnFilters])

  useEffect(() => {
    if (setExportData) {
      setExportData(table.getFilteredRowModel().rows)
    }
  }, [table.getFilteredRowModel().rows])

  useEffect(() => {
    if (setSelection) {
      const selectedRowData = Object.keys(rowSelection)
        .filter((id) => !!data[Number(id)]) // Filter out undefined
        .map((id) => data[Number(id)])
      setSelection(selectedRowData as TData[])
    }
  }, [rowSelection])

  useEffect(() => {
    if (Object.keys(rowSelection).length > 0) {
      table.setRowSelection({})
    }
  }, [data])

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
          {table.getHeaderGroups().map((headerGroup) => {
            const hasPinnedRightCell = headerGroup.headers.some(
              (cell) =>
                cell.getContext().column.columnDef.meta?.pin === 'right',
            )

            return (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  const columnWidth =
                    header.getSize() === 20 ? 'auto' : `${header.getSize()}px`
                  const minWidth =
                    header.getContext().column.columnDef.meta?.minWidth

                  const hasBorder =
                    bordered && headerGroup.headers.length - 1 > index
                  const pinLeft =
                    header.getContext().column.columnDef.meta?.pin === 'left'
                  const pinRight =
                    header.getContext().column.columnDef.meta?.pin === 'right'
                  const secondLastCell =
                    index === headerGroup.headers.length - 2

                  return (
                    <Fragment key={header.id}>
                      {pinRight && (
                        <th
                          className="w-[1px] p-0 bg-blackberry-200 sticky z-10"
                          style={{ right: columnWidth }}
                        />
                      )}
                      <TableHead
                        highlightHeader={highlightHeader}
                        bordered={hasBorder}
                        style={{ width: minWidth || columnWidth }}
                        className={cn(
                          minWidth && 'xl:!w-auto',
                          pinLeft && 'sticky z-10 left-0 border-r-0',
                          pinRight && 'sticky z-10 right-0',
                          hasPinnedRightCell && secondLastCell && 'border-r-0',
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                      {pinLeft && (
                        <th
                          className="w-[1px] p-0 bg-blackberry-200 sticky z-10"
                          style={{ left: columnWidth }}
                        />
                      )}
                    </Fragment>
                  )
                })}
              </TableRow>
            )
          })}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const hasPinnedRightCell = row
                .getVisibleCells()
                .some(
                  (cell) =>
                    cell.getContext().column.columnDef.meta?.pin === 'right',
                )

              return (
                <TableRow
                  key={row.id}
                  className="group"
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell, index) => {
                    const hasBorder =
                      bordered && row.getVisibleCells().length - 1 > index
                    const pinLeft =
                      cell.getContext().column.columnDef.meta?.pin === 'left'
                    const pinRight =
                      cell.getContext().column.columnDef.meta?.pin === 'right'
                    const columnWidth =
                      cell.column.getSize() === 20
                        ? 'auto'
                        : `${cell.column.getSize()}px`
                    const minWidth =
                      cell.getContext().column.columnDef.meta?.minWidth

                    const secondLastCell =
                      index === row.getVisibleCells().length - 2

                    return (
                      <Fragment key={cell.id}>
                        {pinRight && (
                          <td
                            className="w-[1px] p-0 bg-blackberry-200 sticky z-10"
                            style={{ right: columnWidth }}
                          />
                        )}
                        <TableCell
                          bordered={hasBorder}
                          style={{ width: minWidth || columnWidth }}
                          className={cn(
                            minWidth && 'xl:!w-auto',
                            pinLeft &&
                              'sticky z-10 bg-inherit left-0 bg-white group-hover:!bg-blackberry-50 group-data-[state=selected]:bg-blackberry-50 border-r-0',
                            pinRight &&
                              'sticky z-10 bg-inherit right-0 bg-white group-hover:!bg-blackberry-50 group-data-[state=selected]:bg-blackberry-50',
                            hasPinnedRightCell &&
                              secondLastCell &&
                              'border-r-0',
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                        {pinLeft && (
                          <td
                            className="w-[1px] p-0 bg-blackberry-200 sticky z-10 left-0"
                            style={{ left: columnWidth }}
                          />
                        )}
                      </Fragment>
                    )
                  })}
                </TableRow>
              )
            })
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
  type Row,
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
