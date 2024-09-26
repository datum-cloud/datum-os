import { tv } from 'tailwind-variants'

const pageStyles = tv({
  slots: {
    formInner: 'flex flex-col gap-7 space-y-2',
    input: 'flex flex-col gap-2 !mt-0',
  },
})

export { pageStyles }
