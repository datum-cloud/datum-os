import { tv, type VariantProps } from 'tailwind-variants'

const pageStyles = tv({
  slots: {
    logo: 'flex justify-center mb-10',
    bg: 'absolute h-full w-2/3 top-0 left-0 opacity-0 transition-opacity duration-700',
    bgImage: 'object-cover object-center h-full z-10',
    container:
      'flex flex-col h-full max-h-full w-full py-12 px-4 lg:px-0 overflow-auto',
    content:
      'relative z-20 bg-white shadow-auth rounded-lg flex flex-col justify-center mx-auto my-auto py-[42px] px-9 w-full max-w-[357px]',
  },
  variants: {
    wideContent: {
      true: {
        content: 'max-w-[580px] py-[61px] px-[42px]',
      },
    },
    activeBg: {
      true: {
        bg: 'opacity-100',
      },
    },
  },
  defaultVariants: {
    activeBg: false,
  },
})

export type PageVariants = VariantProps<typeof pageStyles>

export { pageStyles }
