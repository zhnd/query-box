import { Alert, AlertDescription } from '@/components/ui/alert'
import { useConnectivityCheckService } from './use-service'

export function ConnectivityCheckInfo(props: {
  checkResult: {
    status?: 'connected' | 'disconnected'
    error?: string
  } | null
  loading: boolean
}) {
  const { checkResult, loading } = props
  const service = useConnectivityCheckService(props)
  if (!checkResult) return null
  return (
    <Alert
      ref={service.wrapperRef}
      className={
        checkResult.error
          ? 'bg-red-50 text-red-800 border-red-200'
          : 'bg-green-50 text-green-800 border-green-200'
      }
    >
      <AlertDescription>
        {loading ? (
          'Testing connection...'
        ) : checkResult.status === 'connected' ? (
          <span className="text-green-800">
            Connection successful! The endpoint is reachable.
          </span>
        ) : (
          <span className="text-red-800">
            Endpoint Error, please try again later: {checkResult.error}
          </span>
        )}
      </AlertDescription>
    </Alert>
  )
}
