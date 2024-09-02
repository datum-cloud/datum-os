import { type ReactNode, type ButtonHTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

export const buttonStyles = tv({
  slots: {
    base: 'relative group text-white font-sans font-semibold gap-[10px] inline-flex items-center justify-center whitespace-nowrap rounded-md leading-none text-sm transition-all duration-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blackberry-300 disabled:pointer-events-none disabled:opacity-50 hover:opacity-90',
    childWrapper: '',
    loadingWrapper:
      'absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2',
    loadingText: 'opacity-0',
    iconOuter: 'relative h-4 w-4 overflow-hidden',
    iconInner: 'absolute transition-all duration-500',
  },
  variants: {
    variant: {
      sunglow: 'text-white bg-sunglow-900',
      blackberry: 'text-white bg-blackberry-900',
      outline: 'border-blackberry-800 text-blackberry-800 border',
      success: 'flex-row-reverse bg-util-green-500',
      failure: 'bg-util-red-500 border text-white',
    },
    size: {
      xs: 'h-auto rounded-none p-0 bg-transparent',
      sm: 'h-9 rounded-none px-4 bg-transparent',
      md: 'h-11 rounded-md text-base px-5 text-button-m',
      lg: 'h-16 px-8 text-button-l',
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
    iconAnimated: {
      true: {
        iconInner: 'group-hover:-translate-y-4',
      },
    },
    iconPosition: {
      left: 'flex-row-reverse',
    },
  },
  compoundVariants: [
    {
      variant: 'sunglow',
      size: 'sm',
      class: 'text-sunglow-900',
    },
    {
      variant: 'blackberry',
      size: 'sm',
      class: 'text-blackberry-900',
    },
    {
      variant: 'outline',
      size: 'sm',
      class: 'text-blackberry-900',
    },
    {
      variant: 'failure',
      size: 'sm',
      class: 'text-white',
    },
    {
      variant: 'success',
      size: 'sm',
      class: 'text-white',
    },
  ],
  defaultVariants: {
    variant: 'sunglow',
    size: 'md',
  },
})

//TODO: Important is needed here for backgrounds due to https://github.com/tailwindlabs/tailwindcss/issues/12734

export type ButtonVariants = VariantProps<typeof buttonStyles>

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {
  asChild?: boolean
  icon?: ReactNode
  loading?: boolean
}
