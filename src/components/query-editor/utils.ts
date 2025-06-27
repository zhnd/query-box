import { createGraphiQLFetcher } from '@graphiql/toolkit'
import {
  buildClientSchema,
  getIntrospectionQuery,
  getNamedType,
  GraphQLSchema,
  IntrospectionQuery,
  OperationDefinitionNode,
  parse,
  TypeInfo,
  visit,
  visitWithTypeInfo,
} from 'graphql'
import { editor, languages, Position, Uri } from 'monaco-editor'
import { MonacoGraphQLAPI } from 'monaco-graphql/esm/api.js'
import { initializeMode } from 'monaco-graphql/initializeMode'
import { CODE_LENS_EXECUTE_OPERATIONS } from './constants'
import { QueryEditorCodeLensOperation, RunGraphQLQueryArguments } from './types'

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

export function getProvideCodeLenses(params: { model: editor.ITextModel }):
  | {
      codeLens: languages.CodeLens[]
      codeLensOperations?: QueryEditorCodeLensOperation[]
    }
  | undefined {
  const { model } = params
  const code = model.getValue()

  const codeLens: languages.CodeLens[] = []
  const codeLensOperations: QueryEditorCodeLensOperation[] = []
  if (!code) return
  try {
    const parsed = parse(code)

    for (const definition of parsed.definitions) {
      if (
        definition.kind !== 'OperationDefinition' ||
        !definition.name ||
        !CODE_LENS_EXECUTE_OPERATIONS.includes(definition.operation)
      ) {
        continue
      }
      const pos = model.getPositionAt(definition.loc?.start ?? 0)
      const runQueryArguments = getCodeLensRunGraphQLQueryArguments({
        definition,
        model,
      })

      codeLensOperations.push(runQueryArguments)

      codeLens.push({
        range: {
          startLineNumber: pos.lineNumber,
          startColumn: 1,
          endLineNumber: pos.lineNumber,
          endColumn: 1,
        },
        id: `run-${definition.operation}-${definition.name?.value}`,
        command: {
          id: 'runGraphQLQuery',
          title: '▶ Run',
          tooltip: `Run ${definition.operation}`,
          arguments: [runQueryArguments],
        },
      })
    }
  } catch {
    // Handle error
    console.warn('Failed to parse GraphQL code for code lens generation')
  }
  return {
    codeLens,
    codeLensOperations,
  }
}

function getCodeLensRunGraphQLQueryArguments(params: {
  definition: OperationDefinitionNode
  model: editor.ITextModel
}): RunGraphQLQueryArguments {
  const { definition, model } = params

  const range = {
    start: model.getPositionAt(definition.loc?.start ?? 0),
    end: model.getPositionAt(definition.loc?.end ?? 0),
  }

  const codeInRange = model.getValueInRange({
    startColumn: range.start.column,
    startLineNumber: range.start.lineNumber,
    endColumn: range.end.column,
    endLineNumber: range.end.lineNumber,
  })

  return {
    definitionNameValue: definition.name?.value || '',
    codeString: codeInRange,
    operationKind: definition.operation,
  }
}
