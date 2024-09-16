import { tv, type VariantProps } from 'tailwind-variants'

export const pageStyles = tv({
  slots: {
    wrapper: 'flex gap-[26px] flex-col',
    actionIcon: 'text-blackberry-400',
    contactSearchSelect: 'h-12 w-[215px] capitalize text-base',
    contactsSearchRow:
      'w-full flex flex-row items-stretch justify-start gap-[17px]',
    contactsButtons: '',
    nameRow: 'flex gap-2',
    copyIcon: 'text-blackberry-400 cursor-pointer',
  },
})

export type PageVariants = VariantProps<typeof pageStyles>
