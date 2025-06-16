import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerAreaProps {
  loading: boolean
  message?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingSpinnerArea(props: LoadingSpinnerAreaProps) {
  const { loading, message, className, size = 'md' } = props
  if (!loading) return null

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  return (
    <div
      className={cn(
        'absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm',
        className
      )}
    >
      <div className="flex flex-col items-center space-y-2">
        <Loader2
          className={cn('animate-spin text-primary', sizeClasses[size])}
        />
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
    </div>
  )
}

export default LoadingSpinnerArea
