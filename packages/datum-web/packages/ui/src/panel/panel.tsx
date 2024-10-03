import React, { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import {
  panelHeaderStyles,
  panelStyles,
  type PanelVariants,
  type PanelHeaderVariants,
} from './panel.styles'
import { TriangleAlert } from 'lucide-react'

interface PanelProps extends PanelVariants {
  className?: string
  children: ReactNode
}

interface PanelHeaderProps extends PanelHeaderVariants {
  heading: React.ReactNode
  className?: string
  icon?: React.ReactNode
  subheading?: React.ReactNode
}

const Panel: React.FC<PanelProps> = ({
  gap,
  align,
  justify,
  textAlign,
  destructive,
  className,
  children,
}) => {
  const styles = panelStyles({ gap, align, justify, textAlign, destructive })
  return <div className={cn(styles.panel(), className)}>{children}</div>
}

const PanelHeader: React.FC<PanelHeaderProps> = ({
  className,
  heading,
  subheading,
  noBorder,
  icon,
}) => {
  const styles = panelHeaderStyles({ noBorder })
  return (
    <div className={cn(styles.header(), className)}>
      <div className={cn(styles.icon())}>
        <h2 className={styles.heading()}>{heading}</h2>
        {icon}
      </div>
      {subheading && <p className={styles.subheading()}>{subheading}</p>}
    </div>
  )
}

export { Panel, PanelHeader }
