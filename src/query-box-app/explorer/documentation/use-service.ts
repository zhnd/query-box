import {
  useExplorerDocumentationCollapsedStore,
  useGraphQLExplorerPageStore,
} from '@/stores'
import { usePageGraphQLSchemaStore } from '@/stores/page-graphql-schema-state'
import { useEffect, useRef } from 'react'

export function useService() {
  const containerRef = useRef<HTMLDivElement>(null)

  const schema = usePageGraphQLSchemaStore((state) => state.schema)
  const schemaLoading = usePageGraphQLSchemaStore((state) => state.loading)
  const schemaError = usePageGraphQLSchemaStore((state) => state.error)
  const navigationStack = useGraphQLExplorerPageStore(
    (state) => state.navigationStack
  )

  const documentationCollapsed = useExplorerDocumentationCollapsedStore(
    (state) => state.isCollapsed
  )

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: 0,
    })
  }, [navigationStack])

  return {
    schema,
    schemaLoading,
    schemaError,
    documentationCollapsed,
    containerRef,
  }
}
