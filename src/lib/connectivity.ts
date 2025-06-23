import { Endpoint } from '@/generated/typeshare-types'
import { fetchGraphqlSchema } from './graphql-schema'

export interface ConnectivityCheckOptions {
  url: string
  auth?: Endpoint['auth']
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
  const { url, headers, auth } = params

  try {
    await fetchGraphqlSchema({
      endpoint: { url, headers: headers || {}, auth },
      isCheckConnectivity: true,
    })
    return { status: 'connected' }
  } catch (error) {
    console.error('Connectivity check failed:', error)
    return {
      status: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
