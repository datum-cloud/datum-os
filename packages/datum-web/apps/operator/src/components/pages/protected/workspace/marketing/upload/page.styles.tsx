import { tv } from 'tailwind-variants'

export const pageStyles = tv({
  slots: {
    wrapper: 'h-full w-full flex gap-[26px] flex-col pb-8',
    header: 'flex items-stretch justify-between',
    link: 'flex gap-1 items-center !text-sunglow-900 text-button-l',
    submissionStateContainer:
      'w-full h-full min-h-[300px] flex gap-2 items-center justify-center',
    panel: 'mb-8',
    formHeader: 'text-body-l font-medium',
    formInner: 'h-full w-full flex flex-col gap-10 mb-8',
    formGroup: 'w-full flex flex-col gap-10',
    formRow: 'w-full flex justify-between gap-4 items-stretch',
    formActions: 'flex items-stretch justify-between',
    formColumnInfo: 'w-2/3 flex flex-col gap-3',
    formFieldInfo: 'flex flex-col gap-3',
    formSelect: 'h-12 min-w-56 text-body-m relative',
    formBoxes: 'w-full grid grid-cols-1',
    uploadContainer: 'flex flex-col gap-12',
    uploadInner: 'w-full flex flex-col gap-6',
  },
})
