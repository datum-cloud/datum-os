import { tv } from 'tailwind-variants'

export const formStyles = tv({
  slots: {
    form: 'w-full flex flex-col gap-6',
    fieldsContainer: 'w-full flex flex-col justify-start gap-2.5',
    labelContainer: 'w-full flex items-center justify-between',
    requiredText: 'type-smallcaps-s text-blackberry-500',
  },
})
