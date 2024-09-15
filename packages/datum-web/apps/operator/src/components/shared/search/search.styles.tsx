import { tv } from 'tailwind-variants'

const searchStyles = tv({
  slots: {
    container: 'hidden lg:flex relative items-center justify-center h-[46px]',
    input: 'w-[478px] pr-[46px] text-white',
    button:
      '!absolute right-0 top-0 h-full aspect-square flex items-center justify-center !text-white',
  },
})

export { searchStyles }
