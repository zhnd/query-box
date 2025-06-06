import { createGraphiQLFetcher } from '@graphiql/toolkit'
import {
  buildClientSchema,
  getIntrospectionQuery,
  GraphQLSchema,
  IntrospectionQuery,
} from 'graphql'
import { Uri } from 'monaco-editor'
import { MonacoGraphQLAPI } from 'monaco-graphql/esm/api.js'
import { initializeMode } from 'monaco-graphql/initializeMode'

export async function updateGraphQLSchema(params: {
  schema: GraphQLSchema
  monacoGraphQLApi: MonacoGraphQLAPI
}): Promise<void> {
  const { schema, monacoGraphQLApi } = params

  monacoGraphQLApi.setSchemaConfig([
    {
      schema,
      uri: 'schema.graphql',
    },
  ])
}

export async function setupGraphQLSchemaInMonaco(params: {
  schema: GraphQLSchema | null
}): Promise<MonacoGraphQLAPI> {
  const { schema } = params

  const monacoGraphQLApi = initializeMode({
    diagnosticSettings: {
      validateVariablesJSON: {
        [Uri.file('operation.graphql').toString()]: [
          Uri.file('variables.json').toString(),
        ],
      },
      jsonDiagnosticSettings: {
        validate: true,
        schemaValidation: 'error',
        allowComments: true,
        trailingCommas: 'ignore',
      },
    },
    schemas: schema
      ? [
          {
            schema,
            uri: 'schema.graphql',
          },
        ]
      : undefined,
  })

  return monacoGraphQLApi
}

export async function getGraphQLSchema(params: {
  endpointUrl: string
}): Promise<GraphQLSchema> {
  const { endpointUrl } = params
  const fetcher = createGraphiQLFetcher({
    url: endpointUrl,
  })

  const data = await fetcher({
    query: getIntrospectionQuery(),
    operationName: 'IntrospectionQuery',
  })
  const introspectionJSON =
    'data' in data && (data.data as unknown as IntrospectionQuery)

  if (!introspectionJSON) {
    throw new Error(
      'Failed to fetch GraphQL introspection schema: subscriptions and HTTP multipart are not supported. Please ensure the endpoint supports standard introspection queries.'
    )
  }
  return buildClientSchema(introspectionJSON)
}
