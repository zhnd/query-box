import { Endpoint } from '@/generated/typeshare-types'
import {
  buildClientSchema,
  getIntrospectionQuery,
  GraphQLSchema,
  IntrospectionQuery,
} from 'graphql'
import { createGraphQLFetcher } from './fetch'
import { formatHeadersStringToObject } from './request'

export async function fetchGraphqlSchema(params: {
  endpoint: Endpoint
  timeout?: number // Request timeout in milliseconds
  signal?: AbortSignal
}): Promise<GraphQLSchema> {
  const { endpoint, timeout, signal } = params

  const fetcher = createGraphQLFetcher({
    url: endpoint.url,
    timeout,
    signal,
    headers: {
      'User-Agent': navigator.userAgent,
      ...formatHeadersStringToObject(endpoint.headers),
    },
  })

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

  return buildClientSchema(introspectionData)
}
