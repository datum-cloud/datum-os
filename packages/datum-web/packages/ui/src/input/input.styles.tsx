import { tv } from 'tailwind-variants'

export const inputStyles = tv({
  slots: {
    input:
      'flex h-11 w-full rounded-md border font-sans autofill:bg-white autofill:text-blackberry-500 autofill:font-sans text-blackberry-800 border-blackberry-400 bg-transparent px-3 py-none text-base transition-colors file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-blackberry-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blackberry-300 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white',
    inputWrapper: 'relative flex items-center',
    iconWrapper:
      'absolute z-20 text-blackberry-500 top-1/2 -translate-y-1/2 right-4',
    prefixWrapper:
      'absolute z-20 rounded-l-md px-4 border text-blackberry-500 h-full left-0 flex items-center bg-winter-sky-700 border-blackberry-400',
  },
})
