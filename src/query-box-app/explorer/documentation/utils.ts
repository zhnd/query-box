import {
  GraphQLFieldMap,
  GraphQLNamedType,
  GraphQLSchema,
  GraphQLType,
  isListType,
  isNonNullType,
  isObjectType,
} from 'graphql'
import { nanoid } from 'nanoid'

export interface BreadcrumbPathType {
  name: string
  id: string
}

const ROOT_TYPE_NAME = 'Root'

export const DEFAULT_PATH: BreadcrumbPathType = {
  name: ROOT_TYPE_NAME,
  id: nanoid(),
}

export interface ParsedTypeInfo {
  namedType: GraphQLNamedType
  isNonNull: boolean
  isList: boolean
  isNonNullList: boolean
  displayName: string
}

export function parseTypeInfo(type: GraphQLType): ParsedTypeInfo {
  let currentType = type
  let isNonNull = false
  let isList = false
  let isNonNullList = false

  if (isNonNullType(currentType)) {
    isNonNull = true
    currentType = currentType.ofType
  }
  if (isListType(currentType)) {
    isList = true
    currentType = currentType.ofType

    if (isNonNullType(currentType)) {
      isNonNullList = true
      currentType = currentType.ofType
    }
  }

  const namedType = currentType as GraphQLNamedType
  let displayName = namedType.name

  if (isList) {
    if (isNonNullList) {
      displayName = `[${displayName}!]`
    } else {
      displayName = `[${displayName}]`
    }
  }

  if (isNonNull) {
    displayName = `${displayName}!`
  }

  return {
    namedType,
    isNonNull,
    isList,
    isNonNullList,
    displayName,
  }
}

export interface DocumentationField {
  name: string
  description: string | null
  type?: ParsedTypeInfo
  subFields?: DocumentationField[]
}

export type CurrentTypeField = {
  name: string
  description: string | null
  subFields?: DocumentationField[]
  operations?: DocumentationField[]
}

function getAllSubFields(params: {
  fields: GraphQLFieldMap<unknown, unknown>
}) {
  const { fields } = params
  return Object.entries(fields).map(([fieldName, field]) => {
    const fieldType = parseTypeInfo(field.type)
    return {
      name: fieldName,
      type: fieldType,
      description: field.description ?? null,
    }
  })
}

export function getCurrentTypeFields(
  schema: GraphQLSchema | null,
  currentTypeName: string
): CurrentTypeField | null {
  if (!schema) return null

  if (currentTypeName === 'Root') {
    return {
      name: ROOT_TYPE_NAME,
      description: null,
      operations: [
        {
          name: 'Query',
          description: 'GraphQL Query operations',
          subFields: getAllSubFields({
            fields: schema.getQueryType()?.getFields() || {},
          }),
        },
        {
          name: 'Mutation',
          description: 'GraphQL Mutation operations',
          subFields: getAllSubFields({
            fields: schema.getMutationType()?.getFields() || {},
          }),
        },
        {
          name: 'Subscription',
          description: 'GraphQL Subscription operations',
          subFields: getAllSubFields({
            fields: schema.getSubscriptionType()?.getFields() || {},
          }),
        },
      ],
    }
  }

  const typeMap = schema.getTypeMap()
  const currentType = typeMap[currentTypeName]

  if (isObjectType(currentType)) {
    const fields = currentType.getFields()
    return {
      name: currentType.name,
      description: currentType.description ?? null,
      subFields: getAllSubFields({ fields }),
    }
  } else {
    return {
      name: currentType.name,
      description: currentType.description ?? null,
    }
  }
}

export function isValidObjectType(
  schema: GraphQLSchema | null,
  typeName: string
): boolean {
  if (!schema) return false

  // Root type is considered valid always
  if (typeName === 'Root') return true

  const typeMap = schema.getTypeMap()
  const type = typeMap[typeName]
  return isObjectType(type)
}
