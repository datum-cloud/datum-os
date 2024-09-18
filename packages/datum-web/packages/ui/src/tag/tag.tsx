import { HTMLAttributes, ReactNode } from 'react'
import { tagStyles, type TagVariants } from './tag.styles'
import { cn } from '../../lib/utils'

export interface TagProps extends TagVariants, HTMLAttributes<HTMLDivElement> {
  children: ReactNode | string
  variant?: TagVariants['status']
}

export const Tag = ({
  children,
  variant = 'default',
  className,
  ...rest
}: TagProps) => {
  const styles = tagStyles({ status: variant })

  return (
    <span className={cn(styles, className)} {...rest}>
      {children}
    </span>
  )
}

export { tagStyles }
