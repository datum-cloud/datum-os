import { type ReactNode, type ButtonHTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

export const buttonStyles = tv({
  slots: {
    base: 'relative group font-semibold inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md leading-none transition-all duration-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blackberry-300 disabled:pointer-events-none disabled:opacity-50 hover:!opacity-90',
    childWrapper: '',
    loadingWrapper:
      'absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2',
    loadingText: 'opacity-0',
    iconOuter: 'relative h-4 w-4 overflow-hidden',
    iconInner: 'absolute transition-all duration-500',
  },
  variants: {
    variant: {
      tableHeader: '!text-blackberry-500 !font-mono',
      sunglowXs: '!text-sunglow-900',
      blackberryXs: 'text-blackberry-900',
      successXs: '!text-util-green-500',
      failureXs: '!text-util-red-500',
      sunglow: '!text-white !bg-sunglow-900',
      blackberry: '!text-white !bg-blackberry-900',
      outline: 'border border-blackberry-800 text-blackberry-800',
      success: '!bg-util-green-500 !text-white',
      failure: '!bg-util-red-500 !text-white',
    },
    iconPosition: {
      left: 'flex-row-reverse',
      right: 'flex-row',
    },
    iconAnimated: {
      true: {
        iconInner: 'group-hover:-translate-y-4',
      },
    },
    size: {
      xs: 'h-auto rounded-none p-0',
      sm: 'h-9 rounded-md px-4 text-button-s font-sans',
      md: 'h-11 rounded-md px-5 text-button-m font-sans',
      lg: 'h-16 px-8 text-button-l font-sans',
    },
    full: {
      true: {
        base: 'flex w-full',
      },
    },
    childFull: {
      true: {
        childWrapper: 'flex w-full',
      },
    },
  },
  defaultVariants: {
    variant: 'sunglow',
    size: 'md',
  },
})

//TODO: Important is needed here due to https://github.com/tailwindlabs/tailwindcss/issues/12734

export type ButtonVariants = VariantProps<typeof buttonStyles>

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {
  asChild?: boolean
  icon?: ReactNode
  loading?: boolean
}
