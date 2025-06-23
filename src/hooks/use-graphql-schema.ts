import { Endpoint } from '@/generated/typeshare-types'
import { fetchGraphqlSchema, formatHeadersStringToObject } from '@/lib'
import { usePageGraphQLSchemaStore } from '@/stores/page-graphql-schema-state'
import { GraphQLSchema } from 'graphql'
import { useCallback, useEffect, useRef } from 'react'

const AUTO_REFRESH_INTERVAL = 1 * 60 * 1000

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
  page?: 'explorer' | 'doc' | 'query-editor'
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
  const initializingRef = useRef(false)

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
      fetchSchemaFromNetwork({
        isTriggerByAutoRefresh: true,
      })
    }, AUTO_REFRESH_INTERVAL)
  }, [endpoint, enableAutoRefresh, clearAutoRefreshTimer])

  const fetchSchemaFromNetwork = useCallback(
    async (params: { isTriggerByAutoRefresh?: boolean }): Promise<void> => {
      const { isTriggerByAutoRefresh = false } = params
      if (!endpoint?.url) return

      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      if (!isTriggerByAutoRefresh) {
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
            endpoint: {
              ...endpoint,
              headers: formatHeadersStringToObject(endpoint.headers || ''),
            },
          })
          if (!parsedSchema) {
            throw new Error('Fetched schema is null or undefined')
          }
          setSchema(parsedSchema)
          setLoading(false)
          setError(null)
          setLastFetchTime(Date.now())
          initializingRef.current = false

          if (enableAutoRefresh) {
            setupAutoRefreshTimer()
          }
        } catch (err) {
          console.error(
            `Error fetching schema for endpoint ${endpoint?.id}:`,
            err
          )
          if (err instanceof DOMException && err.name === 'AbortError') {
            return
          }

          if (retries < maxRetries) {
            retries++
            console.warn(`Retrying schema fetch (${retries}/${maxRetries})...`)
            return attemptFetch()
          }

          const errorMessage = err instanceof Error ? err.message : String(err)

          if (!isTriggerByAutoRefresh) {
            setLoading(false)
            setError(errorMessage)
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
      setSchema,
      setLoading,
      setError,
      setLastFetchTime,
    ]
  )

  const refetch = useCallback(async () => {
    clearAutoRefreshTimer()
    await fetchSchemaFromNetwork({
      isTriggerByAutoRefresh: false,
    })
  }, [fetchSchemaFromNetwork, clearAutoRefreshTimer])

  useEffect(() => {
    if (initializingRef.current) {
      return
    }

    initializingRef.current = true
    setSchema(null)

    fetchSchemaFromNetwork({
      isTriggerByAutoRefresh: false,
    })

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      clearAutoRefreshTimer()
      initializingRef.current = false
    }
  }, [endpoint])

  return {
    schema,
    loading,
    error,
    lastFetchTime,
    refetch,
  }
}
