import { tv } from 'tailwind-variants'

export const pageStyles = tv({
  slots: {
    wrapper: 'flex  gap-[26px] flex-col',
  },
})

export const profileFormStyles = tv({
  slots: {
    formInner: 'flex flex-col md:flex-row md:items-end gap-8 md:gap-4',
    formFieldsContainer:
      'flex flex-col items-stretch gap-4 md:flex-row max-w-[784px] grow',
    formInput: 'w-full lg:max-w-96 grow',
  },
})
