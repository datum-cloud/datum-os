import { tv, type VariantProps } from 'tailwind-variants'

export const labelStyles = tv({
  slots: {
    label:
      'text-body-sm tracking-body-sm leading-[150%] font-sans peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  },
})

export type LabelVariants = VariantProps<typeof labelStyles>
