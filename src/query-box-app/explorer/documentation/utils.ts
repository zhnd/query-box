import {
  getNamedType,
  GraphQLInterfaceType,
  GraphQLNamedOutputType,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLSchema,
  isEnumType,
  isInputObjectType,
  isInterfaceType,
  isLeafType,
  isObjectType,
  isUnionType,
} from 'graphql'
import {
  FieldCompleteDetails,
  fieldGraphQLType,
  FieldMetaInfo,
  NavigationItem,
  NavigationStack,
  OutputFieldInfo,
} from './types'

/**
 * Get the current navigation item.
 * @param navigationStack - The current navigation stack.
 * @returns The current navigation item, or null if it doesn't exist.
 */
export function getCurrentNavigationItem(
  navigationStack: NavigationStack
): NavigationItem | null {
  return navigationStack.length > 0
    ? navigationStack[navigationStack.length - 1]
    : null
}

/**
 * Get the parent navigation item.
 * @param navigationStack - The current navigation stack.
 * @returns The parent navigation item, or null if it doesn't exist.
 */
export function getParentNavigationItem(
  navigationStack: NavigationStack
): NavigationItem | null {
  return navigationStack.length > 1
    ? navigationStack[navigationStack.length - 2]
    : null
}

/**
 * Navigate to a child field in the navigation stack.
 * @param params - The parameters containing navigation stack and field metadata.
 * @returns The updated navigation stack.
 */
export function navigateToChild(params: {
  navigationStack: NavigationStack
  fieldMetaInfo: OutputFieldInfo | FieldMetaInfo
}): NavigationStack {
  const { navigationStack, fieldMetaInfo } = params
  const newNavigationItem = createNavigationItem({ fieldMetaInfo })

  return [...navigationStack, newNavigationItem]
}

/**
 * Navigate to a specific breadcrumb in the navigation stack.
 * @param navigationStack - The current navigation stack.
 * @param targetIndex - The index of the breadcrumb to navigate to.
 * @returns A new navigation stack truncated to the target index.
 */
export function navigateToBreadcrumb(
  navigationStack: NavigationStack,
  targetIndex: number
): NavigationStack {
  return navigationStack.slice(0, targetIndex + 1)
}

/**
 * Navigate back in the navigation stack by removing the last item.
 * If the stack has only one item, it returns the stack unchanged.
 * @param navigationStack - The current navigation stack.
 * @returns The updated navigation stack.
 */
export function navigateBack(
  navigationStack: NavigationStack
): NavigationStack {
  if (navigationStack.length <= 1) return navigationStack
  return navigationStack.slice(0, -1)
}

/**
 * Create a navigation item from the given parameters.
 * @param params - The parameters containing field metadata information.
 * @returns A new navigation item.
 */
export function createNavigationItem(params: {
  fieldMetaInfo?: OutputFieldInfo | FieldMetaInfo
}): NavigationItem {
  const { fieldMetaInfo } = params

  return {
    name: fieldMetaInfo?.name ?? '',
    typeName: fieldMetaInfo?.fieldType ?? '',
    displayType: fieldMetaInfo?.displayType ?? '',
  }
}

/**
 * get the root details of the GraphQL schema
 * This includes the root operation types (Query, Mutation, Subscription)
 */
function getRootDetails(schema: GraphQLSchema): FieldCompleteDetails {
  // only add root operation types if they have fields
  // this prevents empty root nodes from being displayed
  const queryType = schema.getQueryType()
  const mutationType = schema.getMutationType()
  const subscriptionType = schema.getSubscriptionType()

  const metadata: Array<
    OutputFieldInfo & {
      show: boolean
    }
  > = [
    {
      name: 'Query',
      fieldType: 'Query',
      description: queryType?.description || null,
      deprecationReason: null,
      displayType: 'Query',
      show: Boolean(queryType && Object.keys(queryType.getFields()).length),
    },
    {
      name: 'Mutation',
      fieldType: 'Mutation',
      description: mutationType?.description || null,
      deprecationReason: null,
      displayType: 'Mutation',
      show: Boolean(
        mutationType && Object.keys(mutationType.getFields()).length
      ),
    },
    {
      name: 'Subscription',
      fieldType: 'Subscription',
      description: subscriptionType?.description || null,
      deprecationReason: null,
      displayType: 'Subscription',
      show: Boolean(
        subscriptionType && Object.keys(subscriptionType.getFields()).length
      ),
    },
  ]
  const outputFields: Array<OutputFieldInfo> = metadata.filter(
    (item) => item.show
  )
  return {
    info: {
      name: 'Root',
      description:
        'A schema defines the initial root operation type for each kind of operation it supports.',
      deprecationReason: null,
      displayType: 'Root',
      fieldType: null,
    },
    argumentLists: [],
    outputFields,
  }
}

export function navigateToRoot(): NavigationStack {
  return [
    {
      name: 'Root',
      typeName: 'Root',
      displayType: 'Root',
    },
  ]
}

/**
 *
 * @returns A new navigation stack initialized to the root.
 */
export function initializeNavigationStack(): NavigationStack {
  return navigateToRoot()
}

function getOutputFieldsFromNamesType(params: {
  namedType: GraphQLNamedOutputType | GraphQLNamedType
}): OutputFieldInfo[] {
  const { namedType } = params

  if (isObjectType(namedType) || isInterfaceType(namedType)) {
    const returnTypeFields = namedType.getFields()
    return Object.values(returnTypeFields).map<OutputFieldInfo>(
      (returnField) => {
        return {
          name: returnField.name,
          fieldType: getNamedType(returnField.type).name,
          description: returnField.description || null,
          deprecationReason: returnField.deprecationReason || null,
          displayType: returnField.type.toString(),
        }
      }
    )
  }

  if (isUnionType(namedType)) {
    return namedType.getTypes().map<OutputFieldInfo>((memberType) => ({
      name: memberType.name,
      fieldType: memberType.name,
      description: memberType.description || null,
      deprecationReason: null,
      displayType: memberType.name,
    }))
  }

  if (isEnumType(namedType)) {
    return namedType.getValues().map<OutputFieldInfo>((enumValue) => ({
      name: enumValue.name,
      fieldType: namedType.name,
      description: enumValue.description || null,
      deprecationReason: enumValue.deprecationReason || null,
      displayType: enumValue.name,
    }))
  }

  if (isLeafType(namedType)) {
    // Leaf types do not have output fields, but we can return info in field info
  }
  return []
}

/**
 * Get input fields from a named type.
 * @param params - The parameters containing the named type.
 * @returns An array of field metadata information for input fields.
 */
function getInputFieldsFromNamesType(params: {
  namedType: GraphQLNamedType | GraphQLNamedOutputType
}): FieldMetaInfo[] {
  const { namedType } = params

  if (isInputObjectType(namedType)) {
    return Object.values(namedType.getFields()).map<FieldMetaInfo>(
      (inputField) => ({
        name: inputField.name,
        fieldType: getNamedType(inputField.type).name,
        description: inputField.description || null,
        deprecationReason: inputField.deprecationReason || null,
        displayType: inputField.type.toString(),
        defaultValue: JSON.stringify(inputField.defaultValue),
      })
    )
  }
  return []
}

/**
 * Get the parent field type from the schema. can't get args from current item, should get args from parent items
 * @param params - The parameters containing the schema and parent item.
 * @param params.schema - The GraphQL schema.
 * @param params.parentItem - The parent navigation item.
 * @returns The parent field type, or null if not found.
 */
function getParentFieldType(params: {
  schema: GraphQLSchema
  parentItem: NavigationItem | null
}): GraphQLInterfaceType | GraphQLObjectType<unknown, unknown> | null {
  const { schema, parentItem } = params
  if (!parentItem) return null
  let parentType: GraphQLObjectType | GraphQLInterfaceType | null | undefined =
    null
  if (parentItem.typeName === 'Query') {
    parentType = schema.getQueryType()
  } else if (parentItem.typeName === 'Mutation') {
    parentType = schema.getMutationType()
  } else if (parentItem.typeName === 'Subscription') {
    parentType = schema.getSubscriptionType()
  } else {
    const namedType = schema.getType(parentItem.typeName)
    if (isObjectType(namedType) || isInterfaceType(namedType)) {
      parentType = namedType
    }
  }

  return parentType || null
}

/**
 * Get the arguments from the parent field.
 * @param params - The parameters containing the parent field type and current item.
 * @returns An array of field metadata information for the arguments.
 */
function getArgumentsFromParentField(params: {
  parentFieldType:
    | GraphQLInterfaceType
    | GraphQLObjectType<unknown, unknown>
    | null
  currentItem: NavigationItem | null
}): FieldMetaInfo[] {
  const { parentFieldType, currentItem } = params
  if (!parentFieldType || !currentItem) return []
  const current = parentFieldType?.getFields()[currentItem.name]
  if (!current) return []

  return current.args.map<FieldMetaInfo>((arg) => ({
    name: arg.name,
    fieldType: getNamedType(arg.type).name,
    description: arg.description || null,
    deprecationReason: arg.deprecationReason || null,
    displayType: arg.type.toString(),
    defaultValue: JSON.stringify(arg.defaultValue),
  }))
}

function getFieldGraphQLType(params: {
  namedType: GraphQLNamedType | GraphQLNamedOutputType
}): fieldGraphQLType | null {
  const { namedType } = params
  if (isObjectType(namedType) || isInterfaceType(namedType)) {
    return 'object'
  }
  if (isUnionType(namedType)) {
    return 'union'
  }
  if (isEnumType(namedType)) {
    return 'enum'
  }
  if (isInputObjectType(namedType)) {
    return 'input'
  }
  if (isLeafType(namedType)) {
    return 'scalar'
  }
  return null
}

function getFieldScalarInfo(params: {
  namedType: GraphQLNamedType | GraphQLNamedOutputType
}): FieldMetaInfo | undefined {
  const { namedType } = params
  if (isLeafType(namedType)) {
    return {
      name: namedType.name,
      fieldType: namedType.name,
      description: namedType.description || null,
      deprecationReason: null,
      displayType: namedType.name,
    }
  }
}

/**
 * Get the complete details of a field.
 * @param params - The parameters containing the schema and navigation stack.
 * @returns The complete details of the field, or null if not found.
 */
export function getFieldCompleteDetails(params: {
  schema: GraphQLSchema | null
  navigationStack: NavigationStack
}): FieldCompleteDetails | null {
  const { schema, navigationStack } = params
  if (!schema) return null

  const currentItem = getCurrentNavigationItem(navigationStack)
  const parentItem = getParentNavigationItem(navigationStack)

  // if no current item, or current item is root return root details
  if (!currentItem || currentItem.typeName === 'Root') {
    return getRootDetails(schema)
  }

  const parentFieldType = getParentFieldType({
    schema,
    parentItem,
  })

  const argumentLists = getArgumentsFromParentField({
    parentFieldType,
    currentItem,
  })

  const currentField = parentFieldType?.getFields()[currentItem.name]

  const currentType = schema.getType(currentItem.typeName)
  const currentNamedType = getNamedType(currentType)
  if (!currentNamedType) return null
  console.info('getFieldCompleteDetails', {
    parentFieldType,
    currentType,
    currentField,
    argumentLists,
  })
  return {
    info: {
      name: currentField?.name ?? currentItem.name,
      description: currentField?.description || null,
      deprecationReason: currentField?.deprecationReason || null,
      displayType: currentField?.type.toString() || currentItem.displayType,
      fieldType: currentNamedType.name,
      isLeafType: isLeafType(currentNamedType),
      fieldGraphQLType: getFieldGraphQLType({
        namedType: currentNamedType,
      }),
    },
    argumentLists,
    scalarInfo: getFieldScalarInfo({
      namedType: currentNamedType,
    }),
    inputFields: getInputFieldsFromNamesType({
      namedType: currentNamedType,
    }),
    outputFields: getOutputFieldsFromNamesType({
      namedType: currentNamedType,
    }),
  }
}
