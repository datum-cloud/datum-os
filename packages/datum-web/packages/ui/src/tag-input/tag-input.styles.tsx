import { tv, type VariantProps } from 'tailwind-variants'

export const tagInputStyles = tv({
  slots: {
    inlineTagsContainer: 'flex-wrap	flex min-h-11 w-full rounded-md border font-sans autofill:bg-white autofill:text-blackberry-500 autofill:font-sans text-blackberry-800 border-blackberry-400 bg-transparent px-3 py-none text-base transition-colors file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-blackberry-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blackberry-300 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white',
    input: 'border-none outline-none focus:outline-none focus:ring-0 text-body-m py-0 px-0',
    tag: 'bg-winter-sky-800 border-winter-sky-900 text-blackberry-800 py-[7px] px-[10px] rounded-[5px] text-body-m gap-[10px]',
    tagClose: 'text-blackberry-800 p-0',
  },
})

export type TagInputVariants = VariantProps<typeof tagInputStyles>
