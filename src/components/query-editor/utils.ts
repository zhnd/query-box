import { createGraphiQLFetcher } from '@graphiql/toolkit'
import {
  ArgumentNode,
  buildClientSchema,
  FieldNode,
  getIntrospectionQuery,
  getNamedType,
  GraphQLSchema,
  IntrospectionQuery,
  Kind,
  ObjectFieldNode,
  OperationDefinitionNode,
  parse,
  Token,
  TypeInfo,
  visit,
  visitWithTypeInfo,
} from 'graphql'
import { editor, languages, Position, Uri } from 'monaco-editor'
import { MonacoGraphQLAPI } from 'monaco-graphql/esm/api.js'
import { initializeMode } from 'monaco-graphql/initializeMode'
import { CODE_LENS_EXECUTE_OPERATIONS } from './constants'
import {
  FieldPath,
  GetFieldPathTracker,
  QueryEditorCodeLensOperation,
  RunGraphQLQueryArguments,
} from './types'

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

/**
 * Check if the position matches the start token and word.
 * @param startToken The start token of the field.
 * @param targetWord The target word to match.
 * @param position The current position in the editor.
 * @param word The word at the current position.
 * @returns True if the position matches, false otherwise.
 */
function isPositionMatch(params: {
  startToken: Token | undefined
  targetWord: string
  position: Position
  word: editor.IWordAtPosition
}): boolean {
  const { startToken, targetWord, position, word } = params
  if (!startToken || targetWord !== word.word) {
    return false
  }

  const sameLine = startToken.line === position.lineNumber
  const column = position.column
  const hit =
    column >= startToken.column &&
    column <= startToken.column + (startToken.value?.length || 1)

  return sameLine && hit
}

/**
 * Get the operation type name. Ensure the navigation bar's stack is correct
 * @param operation The operation string.
 * @returns The operation type name.
 */
function getOperationTypeName(operation: string): string {
  switch (operation) {
    case 'query':
      return 'Query'
    case 'mutation':
      return 'Mutation'
    case 'subscription':
      return 'Subscription'
    default:
      return 'Unknown'
  }
}

/**
 * Check if the node's position matches the target word at the current position.
 * This is used to determine if the current node is the one we are looking for
 * based on the user's input in the editor.
 */
function checkNodePositionMatchWithTargetWord(params: {
  node: ObjectFieldNode | ArgumentNode | FieldNode | OperationDefinitionNode
  position: Position
  word: editor.IWordAtPosition
}) {
  const { node, position, word } = params
  const startToken = node.loc?.startToken

  let nodeName = ''
  if (node.kind === Kind.OPERATION_DEFINITION) {
    nodeName = node.operation
  } else {
    nodeName = node.name.value
  }
  return isPositionMatch({
    startToken,
    targetWord: nodeName,
    position,
    word,
  })
}

/**
 * Build the field path stack for a given node.
 * @param params The parameters for building the field path stack.
 * @returns The built field path stack.
 */
function buildFieldPathStack(params: {
  node: ObjectFieldNode | ArgumentNode | FieldNode | OperationDefinitionNode
  typeInfo: TypeInfo
  pathTracker: GetFieldPathTracker
}): FieldPath[] {
  const { node, typeInfo, pathTracker } = params

  let name = ''
  let typeName = ''
  let displayType = ''

  if (node.kind === Kind.FIELD) {
    name = node.name.value
    const fieldType = typeInfo.getType()
    const namedType = getNamedType(fieldType)
    typeName = namedType?.name ?? 'Unknown'
    displayType = fieldType?.toString() ?? 'Unknown'
  } else if (node.kind === Kind.ARGUMENT) {
    name = node.name.value
    const argumentType = typeInfo.getArgument()?.type
    const inputType = typeInfo.getInputType()

    const targetType = argumentType ?? inputType
    const namedType = getNamedType(targetType)
    typeName = namedType?.name ?? 'Unknown'
    displayType = targetType?.toString() ?? 'Unknown'
  } else if (node.kind === Kind.OBJECT_FIELD) {
    name = node.name.value
    const fieldType = typeInfo.getInputType()
    const namedType = getNamedType(fieldType)
    typeName = namedType?.name ?? 'Unknown'
    displayType = fieldType?.toString() ?? 'Unknown'
  } else if (node.kind === Kind.OPERATION_DEFINITION) {
    const operationType = getOperationTypeName(node.operation)
    name = operationType
    typeName = operationType
    displayType = operationType
  }

  return [
    ...pathTracker.current,
    {
      name,
      typeName,
      displayType,
    },
  ]
}

function processNodeEntryWithGetFieldPath(params: {
  node: ObjectFieldNode | ArgumentNode | FieldNode | OperationDefinitionNode
  typeInfo: TypeInfo
  pathTracker: GetFieldPathTracker
  position: Position
  word: editor.IWordAtPosition
}): GetFieldPathTracker {
  const { node, typeInfo, position, word, pathTracker } = params

  // if the current node is matched, return the path tracker with the matched path
  // and reset the current path stack
  if (pathTracker.matched) {
    return {
      matched: pathTracker.matched,
      current: [],
    }
  }

  // Check if the current node matches the target word at the current position
  const positionMatchCheckResult = checkNodePositionMatchWithTargetWord({
    node,
    position,
    word,
  })
  const newPathStack = buildFieldPathStack({
    node,
    typeInfo,
    pathTracker,
  })
  // If it matches, we will return the new path stack with the current node added
  if (positionMatchCheckResult) {
    return {
      matched: newPathStack,
      current: [],
    }
  } else {
    // If it does not match, we will return the new path stack without the current node
    // and continue traversing the AST
    return {
      matched: null,
      current: newPathStack,
    }
  }
}

/**
 * Cleanup the path tracker when leaving a node.
 * If the current path is not matched, it will remove the last item from the current path
 * to ensure the path stack is correct for the next node.
 */
function cleanupPathOnLeave(
  pathTracker: GetFieldPathTracker
): GetFieldPathTracker {
  if (!pathTracker.matched) {
    pathTracker.current = pathTracker.current.slice(0, -1)
  }
  return pathTracker
}

function getFieldPathByASTAnalysis({
  code,
  position,
  schema,
  word,
}: {
  code: string
  position: Position
  schema: GraphQLSchema
  word: editor.IWordAtPosition
}): FieldPath[] | null {
  const ast = parse(code)
  const typeInfo = new TypeInfo(schema)
  const defaultFieldPath: FieldPath = {
    name: 'Root',
    typeName: 'Root',
    displayType: 'Root',
  }

  let pathTracker: GetFieldPathTracker = {
    matched: null,
    current: [defaultFieldPath],
  }

  const astContext = {
    typeInfo,
    position,
    word,
  }

  /**
   * Traverse the AST and process each node to get the field path.
   * The traversal will enter and leave each node, updating the path tracker accordingly.
   * If a node matches the target word at the current position, it will set the matched
   * path and exit the search.
   *
   * notes:
   * - AST traversal uses a depth-first approach.
   * - https://astexplorer.net/ can be used to visualize the AST structure.
   */
  visit(
    ast,
    visitWithTypeInfo(typeInfo, {
      OperationDefinition: {
        enter(node) {
          pathTracker = processNodeEntryWithGetFieldPath({
            ...astContext,
            node,
            pathTracker,
          })
        },
        leave() {
          pathTracker = cleanupPathOnLeave(pathTracker)
        },
      },
      Field: {
        enter(node) {
          pathTracker = processNodeEntryWithGetFieldPath({
            ...astContext,
            node,
            pathTracker,
          })
        },
        leave() {
          pathTracker = cleanupPathOnLeave(pathTracker)
        },
      },
      Argument: {
        enter(node) {
          pathTracker = processNodeEntryWithGetFieldPath({
            ...astContext,
            node,
            pathTracker,
          })
        },
        leave() {
          pathTracker = cleanupPathOnLeave(pathTracker)
        },
      },
      ObjectField: {
        enter(node) {
          pathTracker = processNodeEntryWithGetFieldPath({
            ...astContext,
            node,
            pathTracker,
          })
        },
        leave() {
          pathTracker = cleanupPathOnLeave(pathTracker)
        },
      },
    })
  )

  return pathTracker.matched
}

export function handleGoToGraphqlFieldDefinition(params: {
  editor: editor.ICodeEditor
  schema: GraphQLSchema | null
  onViewDefinition?: (fieldPath: FieldPath[] | null) => void
  position?: Position
}) {
  const { schema, editor, position, onViewDefinition } = params
  const currentPosition = position || editor.getPosition()
  const model = editor.getModel()
  if (!currentPosition || !model || !schema) return
  const word = model.getWordAtPosition(currentPosition)
  if (!word) return

  const fieldPath = getFieldPathByASTAnalysis({
    schema,
    code: model.getValue(),
    position: currentPosition,
    word,
  })
  onViewDefinition?.(fieldPath)
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
