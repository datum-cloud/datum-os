import {
  ColumnFiltersState,
  FilterFn,
  Row,
  SortingFn,
  compareItems,
  rankItem,
  sortingFns,
} from '@repo/ui/data-table'

type CustomFilterFn<T> = (
  row: Row<T>,
  columnId: string,
  columnFilters?: ColumnFiltersState,
) => boolean

// Check Handlers
function handleEmpty(value: any, check: boolean) {
  return (check && value) || (!check && !value)
}

function handleContains(value: string, check: string) {
  return value.toLowerCase().includes(check.toLowerCase())
}

function handleEquals(value: any, check: any) {
  return value === check
}

function handleIncludes(value: any[], check: any) {
  return value.some((item: any) => item === check)
}

// Custom Filter Functions
export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  if (!value || value === '') return true

  const cellValue = row.getValue(columnId)

  if (!cellValue) return false

  const itemRank = rankItem(cellValue, value)

  addMeta({
    itemRank,
  })

  return itemRank.passed
}

export const customFilter: CustomFilterFn<any> = (
  row,
  columnId,
  columnFilters,
) => {
  const cellValue = row.getValue(columnId)
  const columnFilter = columnFilters?.find((filter) => filter.id === columnId)
  const { value: check, operator } = columnFilter || {}

  if (!operator) return true

  switch (operator) {
    case 'empty':
      return handleEmpty(cellValue, check as any)
    case 'contains':
      if (typeof cellValue !== 'string' || typeof check !== 'string') {
        return false
      }
      return handleContains(cellValue, check)
    case 'enum':
      return handleEquals(cellValue, check)
    case 'includes':
      if (!cellValue || !Array.isArray(cellValue)) return false
      return handleIncludes(cellValue, check)
    default:
      return true
  }
}

// Custom Sort Functions
export const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId].itemRank!,
      rowB.columnFiltersMeta[columnId].itemRank!,
    )
  }

  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}
