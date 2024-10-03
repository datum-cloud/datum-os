import { tv, type VariantProps } from 'tailwind-variants'

const avatarUploadStyles = tv({
  slots: {
    wrapper:
      'relative rounded border-dashed border border-blackberry-800/40 dark:border-blackberry-400 py-5 px-[110px] pr-5 lg:pr-[110px] text-left lg:text-center h-[109px] flex flex-col lg:flex-row items-center justify-center transition ease-in',
    cropContainer: 'relative h-[350px]',
    avatarPreview: 'absolute left-5',
  },
  variants: {
    isDragActive: {
      true: {
        wrapper: 'border-blackberry-800',
      },
    },
  },
})

export type AvatarUploadVariants = VariantProps<typeof avatarUploadStyles>

export { avatarUploadStyles }
