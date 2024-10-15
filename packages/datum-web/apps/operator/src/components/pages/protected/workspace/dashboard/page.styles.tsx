import { tv } from 'tailwind-variants'

export const pageStyles = tv({
  slots: {
    link: 'text-sunglow-900 hover:underline',
    card: 'w-full lg:w-1/3 lg:max-w-[367px] md:w-1/2',
    cardContent: 'flex flex-col gap-1.5 ml-8',
    row: 'w-full flex flex-wrap gap-6',
  },
})
