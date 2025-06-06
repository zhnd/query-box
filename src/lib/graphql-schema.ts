import { createGraphiQLFetcher } from '@graphiql/toolkit'
import {
  buildClientSchema,
  getIntrospectionQuery,
  GraphQLSchema,
  IntrospectionQuery,
} from 'graphql'

export async function fetchGraphqlSchema(params: {
  endpointUrl: string
  timeout?: number // Request timeout in milliseconds
  signal?: AbortSignal
}): Promise<GraphQLSchema> {
  const { endpointUrl, timeout, signal } = params

  const fetcher = createGraphiQLFetcher({
    url: endpointUrl,
    fetch: (url, options) => {
      return Promise.race([
        fetch(url, {
          ...options,
          signal,
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
