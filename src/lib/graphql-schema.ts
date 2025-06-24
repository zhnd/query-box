import { ProxyHttpBridge } from '@/bridges'
import { Endpoint } from '@/generated/typeshare-types'
import {
  buildClientSchema,
  getIntrospectionQuery,
  GraphQLSchema,
} from 'graphql'
import { getGraphQLRequestHeaders } from './request'

export async function fetchGraphqlSchema(params: {
  endpoint: {
    url: string
    headers?: Record<string, string>
    auth?: Endpoint['auth']
  }
  isCheckConnectivity?: boolean
}): Promise<GraphQLSchema | null> {
  const { endpoint, isCheckConnectivity } = params

  try {
    const schemaResponse = await ProxyHttpBridge.proxy_http_request({
      url: endpoint.url,
      method: 'POST',
      headers: getGraphQLRequestHeaders({
        endpoint: {
          url: endpoint.url,
          auth: endpoint.auth,
        },
        customHeaders: endpoint.headers,
      }),
      body: JSON.stringify({
        query: getIntrospectionQuery(),
        operationName: 'IntrospectionQuery',
      }),
    })

    if (schemaResponse.status_code < 200 || schemaResponse.status_code >= 300) {
      throw new Error(
        `Unexpected response status: ${schemaResponse.status_code} - ${schemaResponse.body}`
      )
    }

    const body = JSON.parse(schemaResponse.body)
    if (body.errors && body.errors.length > 0) {
      throw new Error(
        `GraphQL introspection errors: ${body.errors
          .map((e: { message: string }) => e.message)
          .join(', ')}`
      )
    }

    if (!body?.data?.__schema) {
      throw new Error('Invalid introspection response: schema data missing')
    }

    if (isCheckConnectivity) return null

    return buildClientSchema(body.data)
  } catch (error) {
    console.error('Failed to fetch GraphQL schema:', error)
    throw error instanceof Error ? error : new Error('Unknown error')
  }
}
