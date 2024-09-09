import { tv, type VariantProps } from 'tailwind-variants'

export const tagStyles = tv({
  base: 'rounded-[5px] px-[7px] pt-[1px] pb-[3px] border uppercase font-mono text-[10px] font-semibold',
  variants: {
    status: {
      success: 'border-util-green-500 text-util-green-500',
      default: 'border-blackberry-500 text-blackberry-500',
      muted: 'border-blackberry-500 text-blackberry-500 opacity-50',
    },
  },
})

export type TagVariants = VariantProps<typeof tagStyles>
