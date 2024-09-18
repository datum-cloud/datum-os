import { tv, type VariantProps } from 'tailwind-variants'

const tagStyles = tv({
  base: 'rounded-[5px] px-[7px] pb-[2px] h-[19px] border uppercase font-mono text-[10px] font-semibold leading-[150%] tracking-[0.4px]',
  variants: {
    status: {
      dark: '!border-blackberry-800 text-blackberry-800',
      success: 'border-util-green-500 text-util-green-500',
      default: 'border-blackberry-500 text-blackberry-500',
      muted: 'border-blackberry-500 text-blackberry-500 opacity-50',
      public: '!border-blackberry-700 text-blackberry-700',
      private: '!border-blackberry-400 text-blackberry-400',
    },
  },
})

export type TagVariants = VariantProps<typeof tagStyles>

export { tagStyles }
