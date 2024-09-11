import { LoadingSpinner } from '@repo/ui/loading-spinner'

export const Loading = () => {
  return (
    <section className="flex items-center justify-center h-full w-full">
      <LoadingSpinner size={28} />
    </section>
  )
}
