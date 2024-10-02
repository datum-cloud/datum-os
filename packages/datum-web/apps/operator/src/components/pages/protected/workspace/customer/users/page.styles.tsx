import { tv } from 'tailwind-variants'

export const pageStyles = tv({
  slots: {
    wrapper: 'flex gap-9 flex-col',
    header: 'flex items-stretch justify-between',
    actionIcon: 'text-blackberry-400',
    controlsContainer: 'w-full flex justify-between items-stretch gap-[18px]',
    controlsButtons: 'w-full flex justify-end items-stretch gap-[18px]',
    contactDropdownItem:
      'w-full flex items-center justify-start gap-3 text-button-m cursor-pointer hover:bg-winter-sky-700 hover:dark:bg-peat-800',
    contactDropdownIcon: 'text-blackberry-400',
    loadingSpinner:
      'leading-none left-0 absolute top-[3px] !h-3 !w-3 shrink-0 origin-center animate-spin',
    nameRow: 'flex gap-2',
    copyIcon: 'text-blackberry-400 cursor-pointer',
    accordionContainer: 'w-full border-b-0 px-0',
    accordionTrigger:
      'w-full !h-[30px] py-1.5 px-0 flex items-center font-normal hover:no-underline justify-between gap-3 text-base cursor-pointer px-2 hover:bg-winter-sky-700 hover:dark:bg-peat-800 disabled:opacity-50 disabled:cursor-default',
    accordionContentOuter: 'w-full flex px-2 pb-2',
    accordionContentInner:
      'w-full flex overflow-scroll flex-col items-start justify-start gap-2 max-w-full truncate pt-2 pb-0',
  },
})

export const tableStyles = tv({
  slots: {
    header:
      'w-full flex items-center gap-2 justify-between font-mono text-[12px] tracking-[0.48px] font-semibold text-blackberry-600 uppercase bg-winter-sky-700',
    checkboxContainer: 'flex items-center justify-center',
    link: 'block truncate text-sunglow-900 hover:underline',
    userDetails: 'flex items-center justify-start gap-3',
  },
})

export const formStyles = tv({
  slots: {
    form: 'w-full flex flex-col gap-6',
    fieldsContainer: 'relative w-full flex flex-col justify-start gap-4',
    labelContainer: 'w-full',
    selectItem:
      'w-full flex items-center justify-start gap-3 text-button-m cursor-pointer hover:bg-winter-sky-700 hover:dark:bg-peat-800',
    requiredText:
      'text-smallcaps-s font-bold text-[12px] font-mono uppercase tracking-smallcaps-s leading-[150%] text-blackberry-500 absolute top-1 right-0',
  },
})
