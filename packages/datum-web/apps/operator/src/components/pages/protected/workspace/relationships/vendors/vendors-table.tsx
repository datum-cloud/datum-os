'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { getPathWithParams } from '@repo/common/routes'
import { OPERATOR_APP_ROUTES } from '@repo/constants'
import type { Datum } from '@repo/types'
import { Checkbox } from '@repo/ui/checkbox'
import {
  ColumnDef,
  ColumnFiltersState,
  DataTable,
  DataTableColumnHeader,
  FilterFn,
  Row,
  SortingFn,
  compareItems,
  rankItem,
  sortingFns,
} from '@repo/ui/data-table'
import { Tag } from '@repo/ui/tag'

import { formatDate } from '@/utils/date'

import { tableStyles } from './page.styles'

type VendorsTableProps = {
  vendors: Datum.Vendor[]
  globalFilter: string
  columnFilters?: ColumnFiltersState
  setGlobalFilter(input: string): void
  setSelection(vendors: Datum.Vendor[]): void
  onRowsFetched(vendors: Row<Datum.Vendor>[]): void
}

const { header, checkboxContainer, link } = tableStyles()

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  if (!value || value === '') return true

  const cellValue = row.getValue(columnId)

  if (!cellValue) return false

  const itemRank = rankItem(cellValue, value)

  addMeta({
    itemRank,
  })

  return itemRank.passed
}

const emptyFilter: FilterFn<any> = (row, columnId, value) => Boolean(value)

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!,
    )
  }

  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

const filterFns = {
  fuzzy: fuzzyFilter,
  empty: emptyFilter,
}

export const VENDOR_COLUMNS: ColumnDef<Datum.Vendor>[] = [
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
            aria-label="Select all lists"
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
            aria-label="Select list"
          />
        </div>
      )
    },
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
        column={column}
        children="Company"
      />
    ),
    minSize: 185,
    enableGlobalFilter: true,
    enableSorting: true,
    sortingFn: fuzzySort,
  },
  {
    id: 'contact',
    accessorKey: 'contact',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
        column={column}
        children="Contact"
      />
    ),
    enableGlobalFilter: true,
    enableSorting: true,
    sortingFn: fuzzySort,
    meta: {
      minWidth: 185,
    },
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
        column={column}
        children="Email"
      />
    ),
    minSize: 185,
    enableGlobalFilter: true,
    enableSorting: true,
    cell: ({ cell }) => {
      const value = cell.getValue() as string

      if (!value) return ''

      return (
        <Tag variant={value === 'public' ? 'public' : 'private'}>{value}</Tag>
      )
    },
    sortingFn: fuzzySort,
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
        column={column}
        children="Added"
      />
    ),
    minSize: 200,
    enableGlobalFilter: false,
    enableSorting: false,
    cell: ({ cell }) => {
      const isodate = cell.getValue() as string

      return <>{formatDate(new Date(isodate))}</>
    },
  },
  {
    id: 'updatedAt',
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <DataTableColumnHeader
        className={header()}
        column={column}
        children="Updated"
      />
    ),
    minSize: 200,
    enableGlobalFilter: false,
    enableSorting: false,
    cell: ({ cell }) => {
      const isodate = cell.getValue() as string

      return <>{formatDate(new Date(isodate))}</>
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
    minSize: 185,
    enableGlobalFilter: false,
    enableSorting: false,
    cell: ({ cell }) => {
      const isodate = cell.getValue() as string

      return <Tag>{formatDate(new Date(isodate))}</Tag>
    },
  },
]

const VendorsTable = ({
  vendors,
  globalFilter,
  columnFilters,
  setGlobalFilter,
  setSelection,
  onRowsFetched,
}: VendorsTableProps) => {
  const [filteredLists, setFilteredLists] = useState<Datum.Vendor[]>(vendors)

  useEffect(() => {
    if (vendors) {
      setFilteredLists(vendors)
    }
  }, [vendors])

  return (
    <DataTable
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      filterFns={filterFns}
      globalFilterFn="fuzzy"
      columnFilters={columnFilters}
      columns={VENDOR_COLUMNS}
      data={filteredLists}
      layoutFixed
      bordered
      onRowsFetched={onRowsFetched}
      setSelection={setSelection}
      highlightHeader
      showFooter
    />
  )
}

export default VendorsTable
