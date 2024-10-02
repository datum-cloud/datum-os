import { tv } from 'tailwind-variants'

const searchStyles = tv({
  slots: {
    container:
      'h-11 relative bg-white flex gap-0 items-start justify-start dark:bg-peat-900 rounded-md border border-blackberry-400',
    input:
      'flex h-[42px] transition-all transform duration-1000 w-0 rounded-md border-none dark:text-white',
    button: 'h-[42px] aspect-square shrink-0 rounded-md',
  },
})

export { searchStyles }
