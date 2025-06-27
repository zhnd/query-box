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
  onViewDefinition?: (fieldName: string) => void
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
