import { LoadingSpinner } from '@repo/ui/loading-spinner'
import { cn } from '@repo/ui/lib/utils'

type LoadingProps = {
  className?: string
}

export const Loading = ({ className }: LoadingProps) => {
  return (
    <section
      className={cn(
        'flex items-center justify-center h-full w-full',
        className,
      )}
    >
      <LoadingSpinner size={28} />
    </section>
  )
}
