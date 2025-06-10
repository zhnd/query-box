import { getIntrospectionQuery, IntrospectionQuery } from 'graphql'
import { createGraphQLFetcher } from './fetch'

export interface ConnectivityCheckOptions {
  url: string
  headers?: Record<string, string>
  timeout?: number
  signal?: AbortSignal
}

export interface ConnectivityResult {
  status?: 'connected' | 'disconnected'
  error?: string
}

export async function checkGraphQLEndpointConnectivity(
  params: ConnectivityCheckOptions
): Promise<ConnectivityResult> {
  const { url, timeout, signal, headers } = params

  const fetcher = createGraphQLFetcher({
    url,
    timeout,
    signal,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    },
  })

  try {
    const result = await fetcher({
      query: getIntrospectionQuery(),
      operationName: 'IntrospectionQuery',
    })

    if ('errors' in result && result.errors?.length) {
      throw new Error(
        `GraphQL introspection errors: ${result.errors
          .map((e) => e.message)
          .join(', ')}`
      )
    }

    const introspectionData =
      'data' in result && (result.data as unknown as IntrospectionQuery)
    if (!introspectionData || !introspectionData.__schema) {
      throw new Error('Invalid introspection response: schema data missing')
    }
    return { status: 'connected' }
  } catch (error) {
    return {
      status: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
