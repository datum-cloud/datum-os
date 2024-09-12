'use client'

import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils'
import {
  inputRowStyles,
  InputRowVariants,
  inputStyles,
  type InputVariants,
} from './input.styles'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'>,
    InputVariants {
  icon?: ReactNode
  prefix?: ReactNode
  debounce?: number
  onIconClick?: () => void
}

interface InputRowProps extends InputRowVariants {
  className?: string
  children: ReactNode
}
interface DebouncedInputProps extends Omit<InputProps, 'onChange' | 'value'> {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, icon, prefix, variant, onIconClick, debounce, ...props },
    ref,
  ) => {
    const { input, inputWrapper, iconWrapper, prefixWrapper } = inputStyles({
      variant,
    })
    const hasIcon = Boolean(icon)
    const hasPrefix = Boolean(prefix)
    const prefixRef = useRef<HTMLDivElement>(null)
    const [prefixWidth, setPrefixWidth] = useState(0)

    useEffect(() => {
      if (prefixRef.current) {
        setPrefixWidth(prefixRef.current.offsetWidth)
      }
    }, [prefix])

    return (
      <div className={inputWrapper({ hasIcon, hasPrefix })}>
        {prefix && (
          <div ref={prefixRef} className={prefixWrapper()}>
            {prefix}
          </div>
        )}
        <input
          type={type}
          className={cn(input({ hasIcon, hasPrefix }), className)}
          ref={ref}
          {...props}
          style={{ paddingLeft: hasPrefix ? prefixWidth + 12 : undefined }}
        />
        {icon && (
          <div
            className={iconWrapper()}
            onClick={onIconClick}
            style={{ cursor: onIconClick ? 'pointer' : 'default' }}
          >
            {icon}
          </div>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

const InputRow: React.FC<InputRowProps> = ({ children, className }) => {
  const styles = inputRowStyles()
  return <div className={cn(styles.wrapper(), className)}>{children}</div>
}

const DebouncedInput: React.FC<DebouncedInputProps> = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) => {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

export { DebouncedInput, Input, InputRow }
