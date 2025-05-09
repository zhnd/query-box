import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import * as React from 'react'

interface OverflowTooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string
  tooltipContent?: React.ReactNode
  maxWidth?: string
  truncate?: boolean
  delayDuration?: number
}

export function OverflowTooltip({
  text,
  tooltipContent,
  truncate = true,
  delayDuration = 300,
  className,
  ...props
}: OverflowTooltipProps) {
  const [isOverflowing, setIsOverflowing] = React.useState(false)
  const textRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const { offsetWidth, scrollWidth } = textRef.current
        setIsOverflowing(scrollWidth > offsetWidth)
      }
    }

    checkOverflow()

    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [text])

  if (!isOverflowing) {
    return (
      <div
        ref={textRef}
        className={cn('flex-1 min-w-0 whitespace-nowrap', className)}
        {...props}
      >
        {text}
      </div>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild>
          <div
            ref={textRef}
            className={cn(
              truncate ? 'text-ellipsis whitespace-nowrap overflow-hidden' : '',
              'w-full cursor-default',
              className
            )}
            {...props}
          >
            {text}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-64 break-words">
          {tooltipContent || text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
