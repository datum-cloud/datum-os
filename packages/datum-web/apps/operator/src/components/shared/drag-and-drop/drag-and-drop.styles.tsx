import { tv } from 'tailwind-variants'

export const dragAndDropStyles = tv({
  slots: {
    section: 'flex flex-col items-center justify-start gap-4',
    container:
      'w-full border border-dashed border-blackberry-500 rounded-[5px] flex items-center justify-center min-h-[300px] gap-4 p-8',
    placeholder: 'w-full flex flex-col items-center justify-center gap-4',
    placeholderText:
      'w-full flex flex-col md:flex-row justify-center items-center gap-1',
    link: 'underline p-1 font-normal cursor-pointer',
    fileContainer: 'w-full flex flex-col items-center justify-center gap-5',
    fileContainerInner:
      'w-full flex flex-col items-center justify-center gap-2',
    fileRow: 'w-full flex items-center justify-center gap-2',
    fileCancel: 'h-full aspect-square flex items-center justify-center',
    fileError: 'w-full flex flex-col justify-center items-center gap-3',
    fileSuccess: 'w-full flex flex-row justify-center items-center gap-2',
  },
})
