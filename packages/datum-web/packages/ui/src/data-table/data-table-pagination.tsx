import { ChevronLeftIcon, ChevronRightIcon, Ellipsis } from 'lucide-react'
import { Table } from '@tanstack/react-table'

import { Button } from '../button/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select/select'
import { dataTableStyles } from './data-table.styles'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const {
    footer,
    paginationButton,
    paginationContainer,
    paginationEllipses,
    paginationColumn,
    pageSizeColumn,
    pageSizeTrigger,
  } = dataTableStyles()
  const currentPage = table.getState().pagination.pageIndex
  const nextPage = currentPage + 1
  const prevPage = currentPage - 1
  const lastPage = table.getPageCount() - 1
  const firstPage = 0
  const showEllipses = table.getPageCount() > 3

  return (
    <div className={footer()}>
      <div className={pageSizeColumn()}>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value))
          }}
        >
          <SelectTrigger className={pageSizeTrigger()} style={{ width: 186 }}>
            <SelectValue
              placeholder={`Show ${table.getState().pagination.pageSize} rows`}
            />
          </SelectTrigger>
          <SelectContent side="top" className="">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem
                key={pageSize}
                value={`${pageSize}`}
                className="text-blackberry-400"
              >
                Show {pageSize} rows
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {lastPage > 0 && (
        <div className={paginationColumn()}>
          <div className={paginationContainer()}>
            <Button
              variant="blackberryXs"
              size="xs"
              className={paginationButton()}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="h-4 w-4 text-blackberry-400" />
            </Button>
            <Button
              variant="blackberryXs"
              size="xs"
              className={paginationButton()}
              onClick={() => table.setPageIndex(firstPage)}
              disabled={currentPage === firstPage}
            >
              {firstPage + 1}
            </Button>
            {/*  Ellipsis for pages before */}
            {showEllipses && currentPage > 2 && (
              <div className={paginationEllipses()}>
                <Ellipsis size={14} className="text-blackberry-400" />
              </div>
            )}
            {/* Previous Button */}
            {prevPage > 0 && (
              <Button
                variant="blackberryXs"
                size="xs"
                className={paginationButton()}
                onClick={() => table.setPageIndex(prevPage)}
              >
                {prevPage + 1}
              </Button>
            )}
            {/* Current Button - Placeholder only */}
            {currentPage > 0 && currentPage < lastPage && (
              <Button
                variant="blackberryXs"
                size="xs"
                className={paginationButton()}
                onClick={() => table.setPageIndex(currentPage)}
                disabled
              >
                {currentPage + 1}
              </Button>
            )}
            {/* Next Button */}
            {nextPage > 0 && nextPage < lastPage && (
              <Button
                variant="blackberryXs"
                size="xs"
                className={paginationButton()}
                onClick={() => table.setPageIndex(nextPage)}
              >
                {nextPage + 1}
              </Button>
            )}
            {/*  Ellipsis for pages after */}
            {showEllipses && currentPage < lastPage - 2 && (
              <div className={paginationEllipses()}>
                <Ellipsis size={14} className="text-blackberry-400" />
              </div>
            )}
            <Button
              variant="blackberryXs"
              size="xs"
              className={paginationButton()}
              onClick={() => table.setPageIndex(lastPage)}
              disabled={currentPage === lastPage}
            >
              {lastPage + 1}
            </Button>
            <Button
              variant="blackberryXs"
              size="xs"
              className="h-8 w-8 p-0 flex"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className="h-4 w-4 text-blackberry-400" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
