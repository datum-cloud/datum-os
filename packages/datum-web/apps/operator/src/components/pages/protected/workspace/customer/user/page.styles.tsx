import { tv } from 'tailwind-variants'

export const pageStyles = tv({
  slots: {
    wrapper: 'flex gap-[26px] flex-col',
    link: 'flex gap-1 items-center text-button-l text-sunglow-900',
    userDropdownItem:
      'w-full flex items-center justify-start gap-3 text-button-m cursor-pointer hover:bg-winter-sky-700 hover:dark:bg-peat-800',
    userDropdownIcon: 'text-blackberry-400',
    userHeader: 'w-full flex items-end justify-between',
    userCard: 'flex gap-7 justify-start items-center',
    userImage:
      'h-[83px] w-[83px] flex items-center justify-center shrink-0 bg-winter-sky-800 rounded-[4px]',
    userText: 'flex flex-col gap-0 justify-start items-start',
    userActions: 'flex justify-start items-stretch gap-4',
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

export const tableStyles = tv({
  slots: {
    header:
      'w-full flex items-center gap-2 justify-between font-mono text-[12px] tracking-[0.48px] font-semibold text-blackberry-600 uppercase bg-winter-sky-700',
    checkboxContainer: 'flex items-center justify-center',
    link: 'block truncate text-sunglow-900 hover:underline',
  },
})
