import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface LoadErrorAreaProps {
  error: string | null
  message?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showRetry?: boolean
  onRetry?: () => void
}

export function LoadErrorArea(props: LoadErrorAreaProps) {
  const {
    error,
    message,
    className,
    size = 'md',
    showRetry = false,
    onRetry,
  } = props
  if (!error) return null

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
      <div className="flex flex-col items-center space-y-3 text-center max-w-md mx-4">
        <AlertCircle className={cn('text-destructive', sizeClasses[size])} />
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            {message || 'An error occurred'}
          </p>
          <p className="text-xs text-muted-foreground break-words">{error}</p>
        </div>
        {showRetry && onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        )}
      </div>
    </div>
  )
}

export default LoadErrorArea
