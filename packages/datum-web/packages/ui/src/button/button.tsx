import { Slot } from '@radix-ui/react-slot'
import { forwardRef } from 'react'
import { buttonStyles, type ButtonProps } from './button.styles'
import { CheckIcon, LoaderCircleIcon, X } from 'lucide-react'
import { cn } from '../../lib/utils'

interface ButtonWithIcons extends Omit<ButtonProps, 'icon' | 'iconPosition'> {
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

interface IconInformationProps
  extends Pick<ButtonWithIcons, 'variant' | 'icon'> {}

function getIcon({ icon, variant }: IconInformationProps) {
  if (icon) return icon

  if (variant === 'success') {
    return <CheckIcon />
  }

  if (variant === 'failure') {
    return <X />
  }

  return null
}

const Button = forwardRef<HTMLButtonElement, ButtonWithIcons>(
  (
    {
      asChild = false,
      className,
      loading,
      icon: iconProp,
      iconPosition = 'right',
      iconAnimated,
      variant,
      full,
      childFull,
      ...rest
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    const {
      base,
      childWrapper,
      iconInner,
      loadingWrapper,
      loadingText,
      iconOuter,
    } = buttonStyles({
      variant,
      full,
      childFull,
      iconPosition,
      iconAnimated,
      ...rest,
    })

    const icon = getIcon({
      variant,
      icon: iconProp,
    })

    return (
      <Comp
        className={`button-icon ${base()}${className ? ` ${className}` : ''}`}
        ref={ref}
        {...rest}
      >
        <span className={cn(childWrapper(), loading && loadingText())}>
          {rest.children}
        </span>
        {loading ? (
          <div className={loadingWrapper()}>
            <LoaderCircleIcon className="animate-spin shrink-0 !h-6 !w-6" />
          </div>
        ) : null}
        {icon && !loading ? (
          <div className={iconOuter()}>
            <div className={iconInner()}>
              {icon}
              {icon}
            </div>
          </div>
        ) : null}
      </Comp>
    )
  },
)

Button.displayName = 'Button'

export { Button, buttonStyles }
