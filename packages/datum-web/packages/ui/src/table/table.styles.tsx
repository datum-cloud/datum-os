import { tv, type VariantProps } from 'tailwind-variants'

export const tableStyles = tv({
  slots: {
    container: 'relative w-full overflow-auto border rounded-lg',
    table: 'w-full caption-bottom text-sm font-sans bg-white',
    tableHeader: '[&_tr]:border-b text-left',
    tableBody: '[&_tr:last-child]:border-0',
    tableFooter:
      'flex border-t p-4 border-blackberry-4 font-medium [&>tr]:last:border-b-0 ',
    tableRow:
      'border-b border-blackberry-4 transition-colors hover:bg-blackberry-50 data-[state=selected]:bg-blackberry-50',
    tableHead:
      'h-12 px-4 text-left align-middle font-medium text-blackberry-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400',
    tableCell:
      'px-4 py-3 text-blackberry-800 align-middle [&:has([role=checkbox])]:pr-0',
    tableCaption: 'mt-4 text-sm text-slate-500 dark:text-slate-400',
  },
  variants: {
    highlightHeader: {
      true: {
        tableHead: 'bg-winter-sky-700',
      },
    },
    bordered: {
      true: {
        tableCell: 'border-r border-blackberry-4 [&:has([role=checkbox])]:pr-4',
        tableHead: 'border-r border-blackberry-4 [&:has([role=checkbox])]:pr-4',
      },
    },
  },
})

export type TableVariants = VariantProps<typeof tableStyles>
