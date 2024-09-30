import { tv } from 'tailwind-variants'

const profileFormStyles = tv({
  slots: {
    formInner: 'flex flex-col md:flex-row md:items-end gap-8 md:gap-4',
    formFieldsContainer: 'flex flex-col gap-4 md:flex-row',
    formInput: 'w-full md:w-auto md:min-w-60 lg:min-w-80',
  },
})

export { profileFormStyles }
