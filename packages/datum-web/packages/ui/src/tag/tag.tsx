import { HTMLAttributes, ReactNode } from 'react'
import { tagStyles, type TagVariants } from './tag.styles'
import { cn } from '../../lib/utils'

export interface TagProps extends TagVariants, HTMLAttributes<HTMLDivElement> {
  children: ReactNode | string
  variant?: TagVariants['status']
  truncate?: boolean
}

export const Tag = ({
  children,
  variant = 'default',
  truncate,
  className,
  ...rest
}: TagProps) => {
  const styles = tagStyles({ status: variant })

  if (truncate) {
    return (
      <div
        className={cn(styles, className, 'inline-block max-w-full truncate')}
        {...rest}
      >
        <span className="text-nowrap">{children}</span>
      </div>
    )
  }

  return (
    <span className={cn(styles, className)} {...rest}>
      {children}
    </span>
  )
}

export { tagStyles }
