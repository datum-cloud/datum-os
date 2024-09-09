import { tv } from 'tailwind-variants'

export const tableStyles = tv({
  slots: {
    header:
      'w-full flex items-center gap-2 justify-between font-mono text-[12px] tracking-[0.48px] font-semibold text-blackberry-600 uppercase bg-winter-sky-700',
    checkboxContainer: 'flex items-center justify-center',
    link: 'block truncate text-sunglow-900 hover:underline',
  },
})
