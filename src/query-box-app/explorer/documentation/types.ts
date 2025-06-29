import { OperationTypeNode } from 'graphql'

export interface BreadcrumbPathType {
  name: string
  id: string
}

export interface ParsedGraphQLTypeInfo {
  isNonNull: boolean
  isList: boolean
  isNonNullList: boolean
  displayName: string
}

export interface DocumentationField {
  name: string
  description: string | null
  operationType?: OperationTypeNode
  parsedGraphQLTypeInfo?: ParsedGraphQLTypeInfo
  subFields?: DocumentationField[]
  inputFields?: DocumentationField[]
}

export type CurrentTypeField = {
  name: string
  description?: string | null
  subFields?: DocumentationField[]
  operations?: DocumentationField[]
}
