import { tv } from 'tailwind-variants'

export const pageStyles = tv({
  slots: {
    wrapper: 'flex gap-[26px] flex-col',
    header: 'flex items-stretch justify-between',
    link: 'flex gap-1 items-center text-sunglow-900 text-button-l',
  },
})
