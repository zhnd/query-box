import {
  useExplorerDocumentationCollapsedStore,
  useGraphQLExplorerPageStore,
} from '@/stores'
import { usePageGraphQLSchemaStore } from '@/stores/page-graphql-schema-state'
import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'
import { BreadcrumbPathType } from './types'
import { DEFAULT_PATH, getRootTypeFields } from './utils'

export function useService() {
  const [path, setPath] = useState<BreadcrumbPathType[]>([DEFAULT_PATH])

  const schema = usePageGraphQLSchemaStore((state) => state.schema)
  const schemaLoading = usePageGraphQLSchemaStore((state) => state.loading)
  const schemaError = usePageGraphQLSchemaStore((state) => state.error)

  const viewGraphQLDefinitionField = useGraphQLExplorerPageStore(
    (state) => state.viewGraphQLDefinitionField
  )

  const documentationCollapsed = useExplorerDocumentationCollapsedStore(
    (state) => state.isCollapsed
  )

  useEffect(() => {
    if (!viewGraphQLDefinitionField) return
    setPath([
      DEFAULT_PATH,
      {
        name: viewGraphQLDefinitionField.name,
        id: nanoid(),
      },
    ])
  }, [viewGraphQLDefinitionField])

  // Reset path when schema changes
  useEffect(() => {
    setPath([DEFAULT_PATH])
  }, [schema])

  const currentTypeName = path[path.length - 1].name
  const currentTypeFields = getRootTypeFields({
    schema,
  })

  console.log('currentTypeFields', currentTypeFields)

  return {
    schema,
    schemaLoading,
    schemaError,
    path,
    currentTypeName,
    currentTypeFields,
    documentationCollapsed,
  }
}
