import { type ReactNode, type ButtonHTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

export const buttonStyles = tv({
  slots: {
    base: 'relative group inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md leading-none transition-all duration-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blackberry-300 disabled:pointer-events-none hover:opacity-90 font-mono',
    childWrapper: 'pb-[2px]',
    loadingWrapper:
      'absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2',
    loadingText: 'opacity-0',
    iconOuter: 'relative h-4 w-4 overflow-hidden',
    iconInner: 'absolute transition-all duration-500',
  },
  variants: {
    variant: {
      tag: 'text-blackberry-500 rounded-[5px] uppercase font-mono text-[10px] font-semibold leading-[150%] tracking-[0.4px] border border-blackberry-500 disabled:opacity-50',
      tagSuccess:
        'text-white rounded-[5px] uppercase font-mono text-[10px] font-semibold leading-[150%] tracking-[0.4px] border border-util-green-500 bg-util-green-500 disabled:opacity-50 gap-1',
      tableHeader: '!text-blackberry-600 !font-mono disabled:opacity-50',
      sunglowXs: '!text-sunglow-900',
      blackberryXs: 'text-blackberry-900',
      successXs: '!text-util-green-500',
      failureXs: '!text-util-red-500',
      sunglow: '!text-white !bg-sunglow-900 font-semibold disabled:opacity-50',
      blackberry:
        '!text-white !bg-blackberry-900 font-semibold disabled:opacity-50',
      outline:
        'border border-blackberry-800 text-blackberry-800 font-semibold disabled:opacity-50',
      success:
        '!bg-util-green-500 !text-white font-semibold disabled:opacity-50',
      failure: '!bg-util-red-500 !text-white font-semibold disabled:opacity-50',
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
      tag: {
        base: 'py-0.5 px-[7px] text-[10px] h-[19px] pt-0 px-[7px] pb-[3px]',
        childWrapper: 'h-[19px]',
      },
      xs: 'rounded-none p-0',
      sm: 'h-9 rounded-md px-4 text-button-s',
      md: 'h-11 rounded-md px-5 text-button-m',
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
  },
  compoundVariants: [
    {
      variant: 'success',
      size: 'tag',
      class:
        '!text-white bg-util-green-500 border border-util-green-500 uppercase gap-1',
    },
  ],
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
