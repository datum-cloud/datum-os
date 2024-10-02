'use client'

import React, { ReactNode, useEffect, useRef, useState } from 'react'

import { cn } from '../../lib/utils'

import { inputStyles } from './input.styles'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  icon?: ReactNode
  prefix?: ReactNode
  debounce?: number
  onIconClick?: () => void
}
interface DebouncedInputProps extends Omit<InputProps, 'onChange' | 'value'> {
  value: string
  onChange(value: string): void
  debounce?: number
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, prefix, onIconClick, debounce, ...props }, ref) => {
    const { input, inputWrapper, iconWrapper, prefixWrapper } = inputStyles()
    const hasPrefix = Boolean(prefix)
    const prefixRef = useRef<HTMLDivElement>(null)
    const [prefixWidth, setPrefixWidth] = useState(0)

    useEffect(() => {
      if (prefixRef.current) {
        setPrefixWidth(prefixRef.current.offsetWidth)
      }
    }, [prefix])

    return (
      <div className={inputWrapper()}>
        {prefix && (
          <div ref={prefixRef} className={prefixWrapper()}>
            {prefix}
          </div>
        )}
        <input
          type={type}
          className={cn(input(), className)}
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

export { DebouncedInput, Input }
