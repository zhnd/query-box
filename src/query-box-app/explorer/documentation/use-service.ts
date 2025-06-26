import {
  useExplorerDocumentationCollapsedStore,
  useGraphQLExplorerPageStore,
} from '@/stores'
import { usePageGraphQLSchemaStore } from '@/stores/page-graphql-schema-state'
import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'
import { BreadcrumbPathType, DEFAULT_PATH, getCurrentTypeFields } from './utils'

export function useService() {
  const [path, setPath] = useState<BreadcrumbPathType[]>([DEFAULT_PATH])

  const schema = usePageGraphQLSchemaStore((state) => state.schema)
  const schemaLoading = usePageGraphQLSchemaStore((state) => state.loading)
  const schemaError = usePageGraphQLSchemaStore((state) => state.error)

  const viewGraphQLDefinitionFieldType = useGraphQLExplorerPageStore(
    (state) => state.viewGraphQLDefinitionFieldType
  )

  const documentationCollapsed = useExplorerDocumentationCollapsedStore(
    (state) => state.isCollapsed
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

  // Reset path when schema changes
  useEffect(() => {
    setPath([DEFAULT_PATH])
  }, [schema])

  const currentTypeName = path[path.length - 1].name
  const currentTypeFields = getCurrentTypeFields(schema, currentTypeName)

  const navigateToType = (typeName: string) => {
    setPath([
      ...path,
      {
        name: typeName,
        id: nanoid(),
      },
    ])
  }

  const navigateToBreadcrumb = (index: number) => {
    setPath(path.slice(0, index + 1))
  }

  return {
    schema,
    schemaLoading,
    schemaError,
    path,
    currentTypeName,
    currentTypeFields,
    navigateToType,
    navigateToBreadcrumb,
    documentationCollapsed,
  }
}
