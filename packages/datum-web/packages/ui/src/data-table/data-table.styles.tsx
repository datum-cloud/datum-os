import { tv } from 'tailwind-variants'

export const dataTableStyles = tv({
  slots: {
    footer: 'w-full flex items-center justify-between gap-4 space-x-4',
    paginationColumn: 'w-full flex items-center justify-end space-x-2',
    paginationContainer:
      'flex items-stretch justify-start gap-0 border border-blackberry-400 rounded overflow-hidden',
    paginationButton:
      'h-8 min-w-8 w-auto p-1 flex border-r border-blackberry-400 !text-blackberry-400 disabled:!bg-blackberry-50',
    paginationEllipses:
      'h-8 w-8 p-1 flex items-end justify-center border-r border-blackberry-400',
    pageSizeTrigger: 'h-8 !text-blackberry-400 placeholder-blackberry-400',
    pageSizeColumn: 'flex flex-row justify-start items-stretch',
    tableHeader:
      'uppercase font-mono font-semibold !leading-[150%] !tracking-[0.4px] flex items-center justify-between transition-colors',
  },
})
