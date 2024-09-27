import { tv, type VariantProps } from 'tailwind-variants'

const userMenuStyles = tv({
  slots: {
    dropdownLink:
      'w-full flex cursor-pointer items-center justify-start gap-3 p-2 text-body-m rounded hover:bg-winter-sky-700 hover:dark:bg-peat-800',
    dropdownLinkIcon: 'text-blackberry-400',
    trigger: 'flex items-center gap-2 cursor-pointer',
    subheading: 'leading-none self-start type-smallcaps-m text-blackberry-500',
    dropdownItem: 'flex flex-col justify-start items-start gap-0.5',
    logOutButton:
      'flex flex-row items-center justify-start gap-1 cursor-pointer hover:bg-winter-sky-700 hover:dark:bg-peat-800 transition-colors',
    email: 'text-sunglow-900 hover:underline transition-all',
  },
})

export type UserMenuVariants = VariantProps<typeof userMenuStyles>

export { userMenuStyles }
