import { tv, type VariantProps } from 'tailwind-variants'

export const pageHeadingStyles = tv({
  slots: {
    wrapper: 'flex flex-col gap-[2px] mb-10',
    eyebrow:
      'font-mono uppercase text-sunglow-900 leading-none tracking-[0.025rem] text-[10px] font-semibold',
  },
})

export type PageHeadingVariants = VariantProps<typeof pageHeadingStyles>
