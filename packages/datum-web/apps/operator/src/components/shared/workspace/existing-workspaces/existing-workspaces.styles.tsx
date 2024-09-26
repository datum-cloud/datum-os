import { tv, type VariantProps } from 'tailwind-variants'

const existingWorkspacesStyles = tv({
  slots: {
    container: 'flex content-center gap-4 w-full mx-auto mb-6',
    orgWrapper:
      'transition-all duration-500 flex gap-3 items-center pb-4 relative',
    orgInfo: 'flex flex-col gap-1 items-start flex-1',
    orgTitle: 'font-sans text-blackberry-800 dark:text-white',
    orgSelect: 'transition-opacity duration-300',
  },
})

export type ExistingWorkspacesVariants = VariantProps<
  typeof existingWorkspacesStyles
>

export { existingWorkspacesStyles }
