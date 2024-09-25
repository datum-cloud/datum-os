import { tv, type VariantProps } from 'tailwind-variants'

const signupStyles = tv({
  slots: {
    separator: 'my-7',
    oAuthButton:
      'flex items-center justify-center border rounded-md gap-4 px-5 h-[52px] dark:text-blackberry-800 border-winter-sky-900 font-normal font-sans',
    buttons: 'flex flex-col gap-7',
    keyIcon: 'text-sunglow-900',
    formInner: 'flex flex-col gap-4 space-y-2',
    input: 'flex flex-col gap-2 !mt-0',
  },
})

export type SignupVariants = VariantProps<typeof signupStyles>

export { signupStyles }
