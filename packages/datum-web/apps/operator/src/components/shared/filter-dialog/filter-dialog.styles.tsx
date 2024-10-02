import { tv } from 'tailwind-variants'

export const filterDialogStyles = tv({
  slots: {
    column: 'flex flex-col w-full basis-full gap-5',
    dialogContent:
      'w-full flex flex-col justify-start items-start h-auto p-6 gap-6',
    filterContainer: 'w-full flex gap-4',
    filterTitle: 'text-lg font-semibold font-sans capitalize',
  },
})
