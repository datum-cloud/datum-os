import { tv } from 'tailwind-variants'

export const pageStyles = tv({
  slots: {
    wrapper: 'flex gap-[26px] flex-col',
    link: 'flex gap-1 items-center !text-sunglow-900 text-button-l',
    contactHeader: 'w-full flex items-end justify-between',
    contactCard: 'flex gap-7 justify-start items-center',
    contactImage:
      'h-[83px] w-[83px] flex items-center justify-center shrink-0 bg-winter-sky-800 rounded-[4px]',
    contactText: 'flex flex-col gap-0 justify-start items-start',
    contactActions: 'flex justify-start items-stretch gap-4',
    enrichedData: 'grid grid-cols-2 rounded-lg border border-blackberry-200',
    enrichedDataCell:
      'w-full flex items-stretch justify-start px-6 py-3 border-blackberry-200',
    enrichedDataTitle: 'w-1/3 text-blackberry-800/60 font-normal text-body-m',
    enrichedDataText: 'w-2/3 text-blackberry-800',
    listsPanel: 'bg-blackberry-100/50 gap-4',
    listsActions: 'flex items-start justify-between',
    listsTrigger: 'flex items-center justify-start gap-3',
    listsContainer: 'w-full flex gap-2 flex-wrap',
  },
})

export const deleteDialogStyles = tv({
  slots: {
    content: 'w-full min-h-40 flex flex-col gap-6',
    text: 'flex gap-6 items-center text-util-red-500',
    button: 'w-2/3 bg-white border-util-red-500 text-util-red-500',
    cancelButton: 'w-1/3 ml-0 bg-white',
  },
})
