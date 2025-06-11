import { createGraphiQLFetcher } from '@graphiql/toolkit'
import {
  buildClientSchema,
  getIntrospectionQuery,
  getNamedType,
  GraphQLSchema,
  IntrospectionQuery,
  parse,
  TypeInfo,
  visit,
  visitWithTypeInfo,
} from 'graphql'
import { editor, Position, Uri } from 'monaco-editor'
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

function getFieldTypeByASTAnalysis({
  code,
  position,
  schema,
  word,
}: {
  code: string
  position: Position
  schema: GraphQLSchema
  word: editor.IWordAtPosition
}) {
  const ast = parse(code)
  const typeInfo = new TypeInfo(schema)

  let matchedType: string | null = null

  visit(
    ast,
    visitWithTypeInfo(typeInfo, {
      Field(node) {
        const startToken = node.loc?.startToken

        if (!startToken || node.name.value !== word.word) return

        const sameLine = startToken.line === position.lineNumber
        const column = position.column
        const hit =
          column >= startToken.column &&
          column <= startToken.column + (startToken.value?.length || 1)

        if (sameLine && hit) {
          const fieldType = getNamedType(typeInfo.getType())
          matchedType = fieldType?.toString() ?? null
        }
      },
    })
  )

  return matchedType
}

export function handleGoToGraphqlFieldDefinition(params: {
  editor: editor.ICodeEditor
  schema: GraphQLSchema | null
  onViewDefinition?: (fieldName: string) => void
  position?: Position
}) {
  const { schema, editor, position, onViewDefinition } = params
  const currentPosition = position || editor.getPosition()
  const model = editor.getModel()
  if (!currentPosition || !model || !schema) return
  const word = model.getWordAtPosition(currentPosition)
  if (!word) return

  const fieldType = getFieldTypeByASTAnalysis({
    schema,
    code: model.getValue(),
    position: currentPosition,
    word,
  })
  onViewDefinition?.(fieldType ?? '')
}
