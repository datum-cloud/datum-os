import { tv, type VariantProps } from 'tailwind-variants'

export const pageStyles = tv({
  slots: {
    wrapper: 'flex gap-[26px] flex-col',
    header: 'flex items-stretch justify-between',
    actionIcon: 'text-blackberry-400',
    contactControls: 'flex justify-start items-stretch gap-[18px]',
    contactDropdownItem:
      'w-full flex items-center justify-start gap-3 text-button-m cursor-pointer hover:bg-winter-sky-700',
    contactDropdownIcon: 'text-blackberry-400',
    nameRow: 'flex gap-2',
    copyIcon: 'text-blackberry-400 cursor-pointer',
    accordionContainer: 'w-full border-b-0 px-0',
    accordionTrigger:
      'w-full !h-[30px] py-1.5 px-0 flex items-center font-normal hover:no-underline justify-between gap-3 text-base cursor-pointer px-2 hover:bg-winter-sky-700',
    accordionContentOuter: 'w-full flex px-2 pb-2',
    accordionContentInner:
      'w-full flex overflow-scroll flex-col items-start justify-start gap-2 max-w-full truncate pt-2 pb-0',
  },
})

export const formStyles = tv({
  slots: {
    form: 'w-full flex flex-col gap-6',
    fieldsContainer: 'relative w-full flex flex-col justify-start gap-4',
    labelContainer: 'w-full',
    requiredText:
      'text-smallcaps-s font-bold text-[12px] font-mono uppercase tracking-smallcaps-s leading-[150%] text-blackberry-500 absolute top-1 right-0',
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

export const filterStyles = tv({
  slots: {
    column: 'flex flex-col w-full basis-full gap-5',
    dialogContent:
      'w-full flex flex-col justify-start items-start h-auto p-6 gap-6',
    filterContainer: 'w-full flex gap-4',
    filterTitle: 'text-lg font-semibold font-sans capitalize',
  },
})

export const tagStyles = tv({
  base: 'rounded-[5px] px-[7px] pt-[1px] pb-[2px] h-5 border uppercase font-mono text-[10px] font-semibold leading-[150%] tracking-[0.4px]',
  variants: {
    status: {
      success: 'border-util-green-500 text-util-green-500',
      default: 'border-blackberry-500 text-blackberry-500',
      muted: 'border-blackberry-500 text-blackberry-500 opacity-50',
    },
  },
})

export type TagVariants = VariantProps<typeof tagStyles>
