import {
  GraphQLNamedType,
  GraphQLSchema,
  GraphQLType,
  isListType,
  isNonNullType,
  isObjectType,
} from 'graphql'

export function unwrapType(type: GraphQLType): GraphQLNamedType {
  while (isNonNullType(type) || isListType(type)) {
    type = type.ofType
  }
  return type as GraphQLNamedType
}

export interface DocumentationField {
  name: string
  type: GraphQLNamedType
  isObjectType: boolean
}

interface RootTypeFields {
  query: DocumentationField[]
  mutation: DocumentationField[]
}

type SubTypeFields = DocumentationField[]

export type CurrentTypeFields = RootTypeFields | SubTypeFields | null

export function getCurrentTypeFields(
  schema: GraphQLSchema | null,
  currentTypeName: string
): CurrentTypeFields {
  if (!schema) return null

  // 如果是根类型，显示 Query 和 Mutation
  if (currentTypeName === 'Root') {
    const fields: RootTypeFields = {
      query: [],
      mutation: [],
    }

    // 添加 Query 字段
    const queryType = schema.getQueryType()
    if (queryType) {
      const queryFields = queryType.getFields()
      Object.entries(queryFields).forEach(([fieldName, field]) => {
        const fieldType = unwrapType(field.type)
        fields.query.push({
          name: fieldName,
          type: fieldType,
          isObjectType: isObjectType(fieldType),
        })
      })
    }

    // 添加 Mutation 字段
    const mutationType = schema.getMutationType()
    if (mutationType) {
      const mutationFields = mutationType.getFields()
      Object.entries(mutationFields).forEach(([fieldName, field]) => {
        const fieldType = unwrapType(field.type)
        fields.mutation.push({
          name: fieldName,
          type: fieldType,
          isObjectType: isObjectType(fieldType),
        })
      })
    }

    return fields
  }

  // 处理具体类型
  const typeMap = schema.getTypeMap()
  const currentType = typeMap[currentTypeName]

  if (isObjectType(currentType)) {
    const fields = currentType.getFields()
    return Object.entries(fields).map(([fieldName, field]) => {
      const fieldType = unwrapType(field.type)
      return {
        name: fieldName,
        type: fieldType,
        isObjectType: isObjectType(fieldType),
      }
    })
  }

  return null
}

export function isValidObjectType(
  schema: GraphQLSchema | null,
  typeName: string
): boolean {
  if (!schema) return false

  // Root 是特殊情况，总是有效的
  if (typeName === 'Root') return true

  const typeMap = schema.getTypeMap()
  const type = typeMap[typeName]
  return isObjectType(type)
}
