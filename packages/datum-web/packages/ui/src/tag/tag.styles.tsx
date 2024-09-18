import { tv, type VariantProps } from 'tailwind-variants'

const tagStyles = tv({
  base: 'rounded-[5px] px-[7px] pb-[2px] border uppercase font-mono font-semibold leading-[150%]',
  variants: {
    status: {
      dark: '!border-blackberry-800 text-blackberry-800',
      success: 'border-util-green-500 text-util-green-500',
      default: 'border-blackberry-500 text-blackberry-500',
      muted: 'border-blackberry-500 text-blackberry-500 opacity-50',
      public: '!border-blackberry-700 text-blackberry-700',
      private: '!border-blackberry-400 text-blackberry-400',
    },
    large: {
      true: '!h-[25px] text-body-s tracking-[0.5px]',
      false: 'h-[19px] text-[10px] tracking-[0.4px]',
    },
  },
})

export type TagVariants = VariantProps<typeof tagStyles>

export { tagStyles }
