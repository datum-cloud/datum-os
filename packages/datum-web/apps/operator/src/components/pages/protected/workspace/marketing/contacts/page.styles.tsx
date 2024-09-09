import { tv, type VariantProps } from 'tailwind-variants'

export const pageStyles = tv({
  slots: {
    wrapper: 'flex gap-[26px] flex-col',
    header: 'flex items-stretch justify-between',
    actionIcon: 'text-blackberry-400',
    contactControls: 'flex justify-start items-stretch gap-[18px]',
    contactDropdownItem:
      'w-full flex items-center justify-start gap-3 text-button-m cursor-pointer',
    contactDropdownIcon: 'text-blackberry-400',
    nameRow: 'flex gap-2',
    copyIcon: 'text-blackberry-400 cursor-pointer',
    accordionContainer: 'w-full border-b-0',
    accordionTrigger:
      'w-full !h-[30px] py-1.5 px-0 flex items-center font-normal hover:no-underline justify-between gap-3 text-base cursor-pointer',
    accordionContent:
      'w-full flex flex-col items-start justify-start gap-2 max-w-full truncate pt-2 pb-0',
  },
})

export type PageVariants = VariantProps<typeof pageStyles>
