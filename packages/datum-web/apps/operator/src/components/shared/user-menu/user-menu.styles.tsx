import { tv, type VariantProps } from 'tailwind-variants'

const userMenuStyles = tv({
  slots: {
    trigger: 'flex items-center gap-2 cursor-pointer',
    subheading: 'leading-none self-start type-smallcaps-m text-blackberry-500',
    dropdownItem: 'flex flex-col justify-start items-start gap-0.5',
    logOutButton:
      'flex flex-row items-center justify-start gap-1 cursor-pointer hover:bg-winter-sky-700 transition-colors',
    email: 'text-sunglow-900 hover:underline transition-all',
  },
})

export type UserMenuVariants = VariantProps<typeof userMenuStyles>

export { userMenuStyles }
