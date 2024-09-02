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
  if (variant === 'success') {
    return <CheckIcon />
  }

  if (variant === 'failure') {
    return <X />
  }

  return icon
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
            <LoaderCircleIcon className="animate-spin shrink-0" size={20} />
          </div>
        ) : (
          icon && (
            <div className={iconOuter()}>
              <div className={iconInner()}>{icon}</div>
            </div>
          )
        )}
      </Comp>
    )
  },
)

Button.displayName = 'Button'

export { Button, buttonStyles }
