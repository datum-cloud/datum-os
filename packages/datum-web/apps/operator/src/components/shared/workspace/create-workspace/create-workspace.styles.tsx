import { tv, type VariantProps } from 'tailwind-variants'

const createWorkspaceStyles = tv({
  slots: {
    container: 'flex content-center gap-4 w-full mx-auto',
  },
})

export type CreateWorkspaceVariants = VariantProps<typeof createWorkspaceStyles>

export { createWorkspaceStyles }
