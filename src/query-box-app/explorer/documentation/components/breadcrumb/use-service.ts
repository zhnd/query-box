import { useGraphQLExplorerPageStore } from '@/stores'

export const useBreadcrumbService = () => {
  const setDocumentationPaths = useGraphQLExplorerPageStore(
    (state) => state.setDocumentationPaths
  )

  const documentationPaths = useGraphQLExplorerPageStore(
    (state) => state.documentationPaths
  )

  const navigateToBreadcrumb = (index: number) => {
    if (index < 0 || index >= documentationPaths.length) return
    setDocumentationPaths(documentationPaths.slice(0, index + 1))
  }

  return {
    setDocumentationPaths,
    documentationPaths,
    navigateToBreadcrumb,
  }
}
