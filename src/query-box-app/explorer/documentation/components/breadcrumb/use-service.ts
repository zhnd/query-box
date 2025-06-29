import { useGraphQLExplorerPageStore } from '@/stores'
import { usePageGraphQLSchemaStore } from '@/stores/page-graphql-schema-state'
import React, { useCallback, useEffect } from 'react'
import { navigateToBreadcrumb } from '../../utils'

export const useBreadcrumbService = () => {
  const schema = usePageGraphQLSchemaStore((state) => state.schema)
  const navigationStack = useGraphQLExplorerPageStore(
    (state) => state.navigationStack
  )
  const setNavigationStack = useGraphQLExplorerPageStore(
    (state) => state.setNavigationStack
  )

  const handleBreadcrumbClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const fieldElement = (event.target as HTMLElement).closest(
        '[data-field-index]'
      )
      const index = fieldElement
        ? Number(fieldElement?.getAttribute('data-field-index'))
        : 0
      const newStack = navigateToBreadcrumb(navigationStack, index)
      setNavigationStack(newStack)
    },
    [navigationStack]
  )

  const handleConfigDefaultDocumentationPaths = () => {}

  useEffect(() => {
    handleConfigDefaultDocumentationPaths()
  }, [schema])

  return {
    navigationStack,
    handleBreadcrumbClick,
  }
}
