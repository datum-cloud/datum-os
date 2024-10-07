import { tv, type VariantProps } from 'tailwind-variants'

export const pageStyles = tv({
  slots: {
    wrapper: 'flex gap-[26px] flex-col',
    actionIcon: 'text-blackberry-400',
    inviteRow: 'flex items-center justify-center gap-[10px]',
    inviteCount:
      'flex items-center justify-center bg-sunglow-900 text-[11px] font-semibold rounded-[5px] w-[19px] h-[19px] text-white',
    membersSearchRow: 'flex gap-4 justify-between',
    membersSearchField: '',
    membersContent: 'flex gap-[26px] flex-col h-full',
    membersButtons: 'flex justify-start items-stretch gap-4',
    membersDropdownItem:
      'w-full flex items-center justify-start gap-3 text-button-m cursor-pointer hover:bg-winter-sky-700 hover:dark:bg-peat-800',
    membersDropdownIcon: 'text-blackberry-400',
    nameRow: 'flex gap-2',
    checkboxContainer: 'flex items-center justify-center',
    copyIcon: 'text-blackberry-400 cursor-pointer',
    header:
      'w-full flex items-center gap-2 justify-between font-mono text-[12px] tracking-[0.48px] font-semibold text-blackberry-600 uppercase bg-winter-sky-700',
    link: 'block truncate text-sunglow-900 hover:underline',
    userDetails: 'flex items-center justify-start gap-3 text-blackberry-800',
    userDetailsText: 'text-blackberry-800',
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

export const deleteDialogStyles = tv({
  slots: {
    content: 'w-full min-h-40 flex flex-col gap-6',
    text: 'flex gap-6 items-center text-util-red-500',
    button: 'w-2/3 bg-white border-util-red-500 text-util-red-500',
    cancelButton: 'w-1/3 ml-0 bg-white',
  },
})

export type PageVariants = VariantProps<typeof pageStyles>
