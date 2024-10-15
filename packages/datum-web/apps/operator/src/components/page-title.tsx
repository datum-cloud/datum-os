import { cn } from '@repo/ui/lib/utils'

interface PageTitleProps {
  title: string | React.ReactNode
  description?: string | React.ReactNode
  centered?: boolean
  className?: string
}

const PageTitle = ({
  title,
  description,
  centered = false,
  className,
}: PageTitleProps) => {
  return (
    <div
      className={cn(
        'flex flex-col justify-start items-start gap-2',
        centered ? 'text-center' : undefined,
        className,
      )}
    >
      <h4>{title}</h4>
      {description && (
        <p className="text-lg leading-5 font-thin font-sans">{description}</p>
      )}
    </div>
  )
}

export default PageTitle
