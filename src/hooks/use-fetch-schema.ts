import { createGraphiQLFetcher } from '@graphiql/toolkit'
import {
  buildClientSchema,
  getIntrospectionQuery,
  GraphQLSchema,
  IntrospectionQuery,
} from 'graphql'
import { useCallback, useEffect, useRef, useState } from 'react'

// Cache for storing fetched schemas to prevent redundant network requests
const schemaCache = new Map<
  string,
  {
    schema: GraphQLSchema
    timestamp: number
    headers: string // JSON stringified headers for comparison
  }
>()

// Cache TTL in milliseconds (30 minutes)
const CACHE_TTL = 30 * 60 * 1000

interface SchemaFetchOptions {
  headers?: Record<string, string>
  skipCache?: boolean
  timeout?: number // Request timeout in milliseconds
  maxRetries?: number
}

interface UseSchemaResult {
  schema: GraphQLSchema | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Custom hook to fetch and parse a GraphQL schema from an endpoint
 *
 * @param endpoint - The GraphQL API endpoint URL
 * @param options - Configuration options for fetching the schema
 * @returns Object containing schema, loading state, error state, and refetch function
 */
export function useSchema(
  endpoint: string,
  options: SchemaFetchOptions = {}
): UseSchemaResult {
  const {
    headers = {},
    skipCache = false,
    timeout = 30000,
    maxRetries = 2,
  } = options

  const [schema, setSchema] = useState<GraphQLSchema | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Track abort controller for request cancellation
  const abortControllerRef = useRef<AbortController | null>(null)

  // Headers serialized for comparison
  const headersKey = JSON.stringify(headers)

  // Function to fetch schema with retry logic
  const fetchSchema = useCallback(async () => {
    // Clean up previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Check cache first if not skipping cache
    const cacheKey = `${endpoint}:${headersKey}`
    if (!skipCache && schemaCache.has(cacheKey)) {
      const cachedData = schemaCache.get(cacheKey)!

      // Check if cache is still valid (not expired)
      if (Date.now() - cachedData.timestamp < CACHE_TTL) {
        setSchema(cachedData.schema)
        return
      }

      // Cache expired, remove it
      schemaCache.delete(cacheKey)
    }

    setLoading(true)
    setError(null)

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController()
    let retries = 0

    const attemptFetch = async (): Promise<void> => {
      try {
        // Create GraphiQL fetcher with timeout
        const fetcher = createGraphiQLFetcher({
          url: endpoint,
          headers: headers || {},
          fetch: (url, options) => {
            return Promise.race([
              fetch(url, {
                ...options,
                signal: abortControllerRef.current?.signal,
              }),
              new Promise<never>((_, reject) => {
                setTimeout(
                  () => reject(new Error(`Request timeout after ${timeout}ms`)),
                  timeout
                )
              }),
            ])
          },
        })

        // Execute introspection query
        const result = await fetcher({
          query: getIntrospectionQuery(),
          operationName: 'IntrospectionQuery',
        })

        // Handle GraphQL errors
        if ('errors' in result && result.errors?.length) {
          throw new Error(
            `GraphQL introspection errors: ${result.errors
              .map((e) => e.message)
              .join(', ')}`
          )
        }

        // Validate response shape
        const introspectionData = result as unknown as IntrospectionQuery
        if (!introspectionData || !introspectionData.__schema) {
          throw new Error('Invalid introspection response: schema data missing')
        }

        // Build client schema from introspection results
        const parsedSchema = buildClientSchema(introspectionData)

        // Save to cache with timestamp
        schemaCache.set(cacheKey, {
          schema: parsedSchema,
          timestamp: Date.now(),
          headers: headersKey,
        })

        setSchema(parsedSchema)
      } catch (err) {
        // Handle aborted requests
        if (err instanceof DOMException && err.name === 'AbortError') {
          // Request was aborted, ignore error
          return
        }

        // Retry logic for retriable errors
        if (retries < maxRetries) {
          retries++
          console.warn(`Retrying schema fetch (${retries}/${maxRetries})...`)
          return attemptFetch()
        }

        console.error('Error fetching GraphQL schema:', err)
        setSchema(null)
        setError(err instanceof Error ? err : new Error(String(err)))
      }
    }

    await attemptFetch()
    setLoading(false)
  }, [endpoint, headersKey, skipCache, timeout, maxRetries])

  // Fetch schema when endpoint or headers change
  useEffect(() => {
    fetchSchema()

    // Cleanup function to abort any pending requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchSchema])

  return {
    schema,
    loading,
    error,
    refetch: fetchSchema,
  }
}
