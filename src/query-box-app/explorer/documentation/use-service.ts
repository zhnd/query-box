import { useGraphQLExplorerPageStore } from '@/stores'
import { usePageGraphQLSchemaStore } from '@/stores/page-graphql-schema-state'
import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'
import {
  BreadcrumbPathType,
  DEFAULT_PATH,
  getCurrentTypeFields,
  isValidObjectType,
} from './utils'

export function useService() {
  const [path, setPath] = useState<BreadcrumbPathType[]>([DEFAULT_PATH])

  const schema = usePageGraphQLSchemaStore((state) => state.schema)
  const viewGraphQLDefinitionFieldType = useGraphQLExplorerPageStore(
    (state) => state.viewGraphQLDefinitionFieldType
  )

  useEffect(() => {
    if (!viewGraphQLDefinitionFieldType) return
    setPath([
      DEFAULT_PATH,
      {
        name: viewGraphQLDefinitionFieldType,
        id: nanoid(),
      },
    ])
  }, [viewGraphQLDefinitionFieldType])

  const currentTypeName = path[path.length - 1].name
  const currentTypeFields = getCurrentTypeFields(schema, currentTypeName)

  const navigateToType = (typeName: string) => {
    if (isValidObjectType(schema, typeName)) {
      setPath([
        ...path,
        {
          name: typeName,
          id: nanoid(),
        },
      ])
    }
  }

  const navigateToBreadcrumb = (index: number) => {
    setPath(path.slice(0, index + 1))
  }

  return {
    schema,
    path,
    currentTypeName,
    currentTypeFields,
    navigateToType,
    navigateToBreadcrumb,
  }
}
