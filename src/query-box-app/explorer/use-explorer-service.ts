import {
  useEndpointSelectedStateStore,
  useExplorerDocumentationCollapsedStore,
  useGraphQLExplorerPageStore,
} from '@/stores'

export const useExplorerService = () => {
  const response = useGraphQLExplorerPageStore((state) => state.response)
  const currentPageSelectedEndpoint = useEndpointSelectedStateStore(
    (state) => state.currentPageSelectedEndpoint
  )

  const documentationCollapsed = useExplorerDocumentationCollapsedStore(
    (state) => state.isCollapsed
  )

  return { response, currentPageSelectedEndpoint, documentationCollapsed }
}
