import { useState } from 'react'
import { usePageGraphQLSchemaStore } from '@/stores/page-graphql-schema-state'
import { getCurrentTypeFields, isValidObjectType } from './utils'

export function useService() {
  const schema = usePageGraphQLSchemaStore((state) => state.schema)
  const [path, setPath] = useState<string[]>(['Root'])

  const currentTypeName = path[path.length - 1]
  const currentTypeFields = getCurrentTypeFields(schema, currentTypeName)

  const navigateToType = (typeName: string) => {
    if (isValidObjectType(schema, typeName)) {
      setPath([...path, typeName])
    }
  }

  const navigateToBreadcrumb = (index: number) => {
    setPath(path.slice(0, index + 1))
  }

  console.log('useService schema', schema)

  return {
    schema,
    path,
    currentTypeName,
    currentTypeFields,
    navigateToType,
    navigateToBreadcrumb,
  }
}
