import { tv, type VariantProps } from 'tailwind-variants'

export const pageStyles = tv({
  slots: {
    wrapper: 'flex gap-[26px] flex-col',
    actionIcon: 'text-blackberry-400',
    contactsSearchRow: 'flex justify-between mb-[26px]',
    contactsSearchField: '',
    contactsButtons: '',
    nameRow: 'flex gap-2',
    copyIcon: 'text-blackberry-400 cursor-pointer',
  },
})

export type PageVariants = VariantProps<typeof pageStyles>
