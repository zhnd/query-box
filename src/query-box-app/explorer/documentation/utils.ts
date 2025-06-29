import {
  GraphQLField,
  GraphQLFieldMap,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLType,
  isListType,
  isNonNullType,
  isObjectType,
  OperationTypeNode,
} from 'graphql'
import { Maybe } from 'graphql/jsutils/Maybe'
import { nanoid } from 'nanoid'
import {
  BreadcrumbPathType,
  CurrentTypeField,
  DocumentationField,
  ParsedGraphQLTypeInfo,
} from './types'

const ROOT_TYPE_NAME = 'Root'

export const DEFAULT_PATH: BreadcrumbPathType = {
  name: ROOT_TYPE_NAME,
  id: nanoid(),
}

export function parseTypeInfo(type: GraphQLType): ParsedGraphQLTypeInfo {
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

  const displayName = type.toString()

  return {
    isNonNull,
    isList,
    isNonNullList,
    displayName,
  }
}

function getAllSubFields(params: {
  fields: GraphQLFieldMap<unknown, unknown> | undefined
}): DocumentationField[] {
  const { fields } = params
  if (!fields) return []
  return Object.entries(fields).map(([fieldName, field]) => {
    const fieldType = parseTypeInfo(field.type)
    return {
      name: fieldName,
      type: fieldType,
      description: field.description ?? null,
    }
  })
}

export function getRootTypeFields(params: {
  schema: GraphQLSchema | null
}): CurrentTypeField | null {
  const { schema } = params
  if (!schema) return null

  const rawOperations: CurrentTypeField['operations'] = [
    {
      name: 'Query',
      description: 'GraphQL Query operations',
      operationType: OperationTypeNode.QUERY,
      subFields: getAllSubFields({
        fields: schema.getQueryType()?.getFields(),
      }),
    },
    {
      name: 'Mutation',
      description: 'GraphQL Mutation operations',
      operationType: OperationTypeNode.MUTATION,
      subFields: getAllSubFields({
        fields: schema.getMutationType()?.getFields(),
      }),
    },
    {
      name: 'Subscription',
      description: 'GraphQL Subscription operations',
      operationType: OperationTypeNode.SUBSCRIPTION,
      subFields: getAllSubFields({
        fields: schema.getSubscriptionType()?.getFields(),
      }),
    },
  ]

  const filterEmptySubFieldOperations = rawOperations.filter(
    (op) => op.subFields?.length
  )
  if (!filterEmptySubFieldOperations.length) {
    return null
  }
  return {
    name: ROOT_TYPE_NAME,
    description: 'Root GraphQL type containing all operations',
    operations: filterEmptySubFieldOperations,
  }
}

export function getOperationInputFields(params: {
  field: GraphQLField<unknown, unknown, unknown>
}): DocumentationField[] {
  const { field } = params

  return field.args.map((arg) => ({
    name: arg.name,
    description: arg.description ?? null,
    type: parseTypeInfo(arg.type),
  }))
}

export function getOperationOutputFields(params: {
  field: GraphQLField<unknown, unknown, unknown>
  schema?: GraphQLSchema | null
}): DocumentationField[] {
  const { field, schema } = params
  if (!schema) return []
  const fieldType = field.type
  if (!isObjectType(fieldType)) {
    return []
  }

  const fields = fieldType.getFields()
  return getAllSubFields({
    fields,
  })
}

/**
 * get the operation signature for a given operation type
 * This includes both output and input fields for the operation
 */
export function getOperationSignature(params: {
  schema: GraphQLSchema | null
  operationType: OperationTypeNode
  operationName: string | undefined
}): DocumentationField[] | undefined {
  const { schema, operationType, operationName } = params
  if (!schema) return []

  let rootOperationType: Maybe<GraphQLObjectType>

  switch (operationType) {
    case OperationTypeNode.QUERY:
      rootOperationType = schema.getQueryType()
      break
    case OperationTypeNode.MUTATION:
      rootOperationType = schema.getMutationType()
      break
    case OperationTypeNode.SUBSCRIPTION:
      rootOperationType = schema.getSubscriptionType()
      break
    default: {
      const _exhaustiveCheck: never = operationType
      throw new Error(`Unhandled operation type: ${_exhaustiveCheck}`)
    }
  }

  if (!rootOperationType) {
    throw new Error(`Unhandled operation type: ${operationType}`)
  }

  const field = rootOperationType.getFields()[operationName ?? '']
  if (!field) {
    console.warn(
      `No fields found for operation type: ${operationType}, operation name: ${operationName}`
    )
    return []
  }

  const inputFields = getOperationInputFields({
    field,
  })

  const outputFields = getOperationOutputFields({
    schema,
    field,
  })

  console.log('getOperationSignature', {
    operationType,
    operationName,
    inputFields,
    outputFields,
  })

  if (inputFields.length === 0 && outputFields.length === 0) {
    return []
  }
  return []
}

export function getCurrentTypeFields(params: {
  schema: GraphQLSchema | null
  field: {
    name: string
  }
  operation?: {
    operationType?: OperationTypeNode
  }
}): CurrentTypeField | null {
  const {
    schema,
    field: { name },
    operation,
  } = params
  if (!schema) return null

  if (operation?.operationType) {
    const signature = getOperationSignature({
      schema,
      operationType: operation.operationType,
      operationName: name,
    })
    console.log('getCurrentTypeFields signature', {
      signature,
    })
  }

  return null

  // if (isObjectType(currentType)) {
  //   const fields = currentType.getFields()
  //   return {
  //     name: currentType.name,
  //     description: currentType.description ?? null,
  //     subFields: getAllSubFields({ fields }),
  //   }
  // } else {
  //   return {
  //     name: currentType.name,
  //     description: currentType.description ?? null,
  //   }
  // }
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
