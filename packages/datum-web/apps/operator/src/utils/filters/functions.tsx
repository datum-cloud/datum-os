import {
  FilterFn,
  SortingFn,
  compareItems,
  rankItem,
  sortingFns,
} from '@repo/ui/data-table'

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

export const booleanFilter: FilterFn<any> = (row, columnId, value) => {
  let cellValue = row.getValue(columnId)

  if (typeof cellValue === 'string') {
    cellValue = cellValue.trim()
  }

  return Boolean(cellValue) === value
}

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
