import { cn } from '@repo/ui/lib/utils'

import { errorStyles } from './error.styles'

type ErrorProps = {
  className?: string
}

export const Error = ({ className }: ErrorProps) => {
  const { container } = errorStyles()

  return (
    <section className={cn(container(), className)}>
      <h3>Whoops... something went wrong</h3>
    </section>
  )
}
