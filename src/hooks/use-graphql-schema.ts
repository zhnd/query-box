import { Endpoint } from '@/generated/typeshare-types'
import { fetchGraphqlSchema } from '@/lib'
import { usePageGraphQLSchemaStore } from '@/stores/page-graphql-schema-state'
import { GraphQLSchema } from 'graphql'
import { useCallback, useEffect, useRef } from 'react'

const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000

interface SchemaFetchOptions {
  headers?: Record<string, string>
  timeout?: number
  maxRetries?: number
  enableAutoRefresh?: boolean
}

interface UseGraphQLSchemaResult {
  schema: GraphQLSchema | null
  loading: boolean
  error: string | null
  lastFetchTime?: number
  refetch: () => Promise<void>
}

export function useGraphQLSchema(data: {
  endpoint: Endpoint | null
  options?: SchemaFetchOptions
}): UseGraphQLSchemaResult {
  const {
    endpoint,
    options: { timeout = 30000, maxRetries = 2, enableAutoRefresh = true } = {},
  } = data

  const schema = usePageGraphQLSchemaStore((state) => state.schema)
  const loading = usePageGraphQLSchemaStore((state) => state.loading)
  const error = usePageGraphQLSchemaStore((state) => state.error)
  const lastFetchTime = usePageGraphQLSchemaStore(
    (state) => state.lastFetchTime
  )

  const setSchema = usePageGraphQLSchemaStore((state) => state.setSchema)
  const setLoading = usePageGraphQLSchemaStore((state) => state.setLoading)
  const setError = usePageGraphQLSchemaStore((state) => state.setError)
  const setLastFetchTime = usePageGraphQLSchemaStore(
    (state) => state.setLastFetchTime
  )

  const autoRefreshTimerRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const clearAutoRefreshTimer = useCallback(() => {
    if (autoRefreshTimerRef.current) {
      clearTimeout(autoRefreshTimerRef.current)
      autoRefreshTimerRef.current = null
    }
  }, [])

  const setupAutoRefreshTimer = useCallback(() => {
    if (!enableAutoRefresh) return

    clearAutoRefreshTimer()

    autoRefreshTimerRef.current = setTimeout(() => {
      console.log(`Auto-refreshing schema for endpoint: ${endpoint?.id}`)
      fetchSchemaFromNetwork(true)
    }, AUTO_REFRESH_INTERVAL)
  }, [endpoint, enableAutoRefresh, clearAutoRefreshTimer])

  const fetchSchemaFromNetwork = useCallback(
    async (isAutoRefresh = false): Promise<void> => {
      if (!endpoint?.url) return

      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      if (!isAutoRefresh) {
        setLoading(true)
        setError(null)
      } else {
        setError(null)
      }

      abortControllerRef.current = new AbortController()
      let retries = 0

      const attemptFetch = async (): Promise<void> => {
        try {
          const parsedSchema = await fetchGraphqlSchema({
            endpointUrl: endpoint.url,
            timeout,
            signal: abortControllerRef.current?.signal,
          })

          setSchema(parsedSchema)
          setLoading(false)
          setError(null)
          setLastFetchTime(Date.now())

          console.log(
            `Schema fetched successfully for endpoint: ${endpoint?.id}`
          )

          if (enableAutoRefresh) {
            setupAutoRefreshTimer()
          }
        } catch (err) {
          console.error(
            `Error fetching schema for endpoint ${endpoint?.id}:`,
            err
          )
          if (err instanceof DOMException && err.name === 'AbortError') {
            console.log('Schema fetch request was aborted')
            return
          }

          if (retries < maxRetries) {
            retries++
            console.warn(`Retrying schema fetch (${retries}/${maxRetries})...`)
            return attemptFetch()
          }

          const errorMessage = err instanceof Error ? err.message : String(err)
          console.error('Error fetching GraphQL schema:', err)

          if (isAutoRefresh && schema) {
            setError(`Auto-refresh failed: ${errorMessage}`)
            console.warn(
              'Auto-refresh failed, keeping existing schema:',
              errorMessage
            )

            if (enableAutoRefresh) {
              setupAutoRefreshTimer()
            }
          }
        }
      }

      return attemptFetch()
    },
    [
      endpoint,
      timeout,
      maxRetries,
      enableAutoRefresh,
      schema,
      setupAutoRefreshTimer,
    ]
  )

  const refetch = useCallback(async () => {
    clearAutoRefreshTimer()
    await fetchSchemaFromNetwork(false)
  }, [fetchSchemaFromNetwork, clearAutoRefreshTimer])

  useEffect(() => {
    if (!endpoint?.url) return

    if (loading) return

    if (!schema) {
      fetchSchemaFromNetwork(false)
    } else if (enableAutoRefresh) {
      setupAutoRefreshTimer()
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      clearAutoRefreshTimer()
    }
  }, [endpoint?.url, schema, loading, enableAutoRefresh])

  return {
    schema,
    loading,
    error,
    lastFetchTime,
    refetch,
  }
}
