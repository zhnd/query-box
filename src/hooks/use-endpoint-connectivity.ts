import {
  checkGraphQLEndpointConnectivity,
  ConnectivityCheckOptions,
} from '@/lib'
import { useCallback, useRef, useState } from 'react'

export interface UseGraphQLConnectivityOptions {
  url?: string
  headers?: Record<string, string>
  timeout?: number
}

export function useEndpointConnectivity(
  options?: UseGraphQLConnectivityOptions
) {
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<{
    status?: 'connected' | 'disconnected'
    error?: string
  } | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)

  const cancel = useCallback(() => {
    setResult(null)
    setLoading(false)
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
  }, [])

  const checkConnectivity = useCallback(
    async (params?: Partial<UseGraphQLConnectivityOptions>) => {
      setLoading(true)

      const finalOptions: ConnectivityCheckOptions = {
        url: options?.url || '',
        ...options,
        ...params,
        signal: abortControllerRef.current?.signal,
      }

      abortControllerRef.current = new AbortController()
      const connectivityResult =
        await checkGraphQLEndpointConnectivity(finalOptions)

      if (abortControllerRef.current?.signal.aborted) {
        return
      }

      setResult(connectivityResult)

      setLoading(false)
      abortControllerRef.current = null
    },
    []
  )

  return {
    loading,
    cancel,
    checkConnectivity,
    result,
  }
}
