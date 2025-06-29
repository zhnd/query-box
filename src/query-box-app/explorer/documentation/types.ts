// navigation stack is used to keep track of the current navigation path
export type NavigationStack = NavigationItem[]

// navigation item is used to represent a node in the GraphQL schema navigation
export interface NavigationItem {
  // current node's name
  name: string
  // current node's GraphQL type: e.g. User, Post, String etc.
  typeName: string

  displayType: string
}

export interface FieldMetaInfo {
  // field name
  name: string
  description: string | null
  deprecationReason: string | null
  // the type of the field, e.g. String, Int, User, Post etc.
  // no information about list or non-null, used for get sub-fields or meta information
  // e.g. User, Post, String, Int, Boolean etc.
  fieldType: string | null
  // display name for the field (e.g. User, [Post], [String!]!)
  // includes list and non-null information
  displayType: string
  // the default value of the input field
  defaultValue?: string | null
  // the graphQLArguments of the field
}

export type OutputFieldInfo = FieldMetaInfo

export type fieldGraphQLType =
  | 'object'
  | 'input'
  | 'interface'
  | 'union'
  | 'scalar'
  | 'enum'
  | null

export interface FieldDetailBasicInfo extends FieldMetaInfo {
  isLeafType?: boolean
  fieldGraphQLType?: fieldGraphQLType
}
export interface FieldCompleteDetails {
  // Field metadata information of current selected field
  info: FieldDetailBasicInfo

  // the argumentLists of the field
  argumentLists: Array<FieldMetaInfo>
  scalarInfo?: FieldMetaInfo
  inputFields?: Array<FieldMetaInfo>
  // the output fields of the field
  outputFields: Array<OutputFieldInfo>
}
