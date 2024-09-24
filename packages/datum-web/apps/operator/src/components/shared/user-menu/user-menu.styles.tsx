import { tv, type VariantProps } from 'tailwind-variants'

const userMenuStyles = tv({
  slots: {
    accordion: 'w-full px-0',
    accordionItem: 'border-b-0 py-0',
    accordionTrigger: 'hover:no-underline py-0 cursor-pointer',
    accordionTriggerInner: 'flex flex-col justify-start items-start',
    accordionTriggerInnerText:
      'w-full flex items-center justify-between rounded',
    accordionTriggerInnerLabel: 'text-body-m font-normal text-blackberry-800',
    accordionLink:
      'w-full flex items-center justify-start gap-3 py-1 px-2 text-body-m rounded hover:bg-winter-sky-700 hover:dark:bg-peat-800',
    accordionLinkIcon: 'text-blackberry-400',
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
