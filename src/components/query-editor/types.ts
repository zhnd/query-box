import { GraphQLSchema, OperationTypeNode } from 'graphql'

export interface QueryEditorOnUpdateLensOperationsActionParameters {
  codeLensOperations: QueryEditorCodeLensOperation[] | null
}

export type QueryEditorOnUpdateLensOperationsAction = (
  data: QueryEditorOnUpdateLensOperationsActionParameters
) => void

export interface QueryEditorProps {
  initialValue?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
  schema: GraphQLSchema | null
  onViewDefinition?: (fieldPath: FieldPath[] | null) => void
  runGraphQLQuery?: (args: RunGraphQLQueryArguments) => void
  onUpdateLensOperations?: QueryEditorOnUpdateLensOperationsAction
}

export interface QueryEditorCodeLensOperation {
  definitionNameValue: string
  codeString: string
  operationKind: OperationTypeNode
}

export type RunGraphQLQueryArguments = {
  definitionNameValue: string
  codeString: string
  operationKind: OperationTypeNode
}

export interface FieldPath {
  name: string
  typeName: string
  displayType: string
}

export interface GetFieldPathTracker {
  // Tracks the currently matched field paths
  matched: FieldPath[] | null
  // Tracks the current field path being built
  // If the current node matches the found content, set it as the matched path and exit the search.
  current: FieldPath[]
}
