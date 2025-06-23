import { Badge } from '@/components/ui/badge'
import { HttpResponse } from '@/generated/typeshare-types'
import { cn } from '@/lib/utils'
import { CheckCircle, Clock, XCircle } from 'lucide-react'

interface RequestStatusIndicatorProps {
  response: HttpResponse | null
  isLoading?: boolean
}

export function RequestStatusIndicator(props: RequestStatusIndicatorProps) {
  const { response, isLoading = false } = props

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4 animate-spin" />
        <span>Sending...</span>
      </div>
    )
  }

  if (!response) {
    return null
  }

  const isSuccess = response.status_code >= 200 && response.status_code < 300
  const isClientError =
    response.status_code >= 400 && response.status_code < 500
  const isServerError = response.status_code >= 500

  const formatDuration = (ms: number) => {
    if (ms < 1000) {
      return `${ms}ms`
    } else if (ms < 60000) {
      return `${(ms / 1000).toFixed(1)}s`
    } else {
      return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`
    }
  }

  return (
    <div className="flex items-center gap-3">
      {/* Status Badge */}
      <Badge
        variant={isSuccess ? 'default' : 'destructive'}
        className={cn(
          'flex items-center gap-1 text-xs',
          isSuccess && 'bg-green-100 text-green-800 hover:bg-green-100',
          isClientError && 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
          isServerError && 'bg-red-100 text-red-800 hover:bg-red-100'
        )}
      >
        {isSuccess ? (
          <CheckCircle className="h-3 w-3" />
        ) : (
          <XCircle className="h-3 w-3" />
        )}
        {response.status_code}
      </Badge>

      {/* Duration */}
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>{formatDuration(response.duration_ms)}</span>
      </div>
    </div>
  )
}
