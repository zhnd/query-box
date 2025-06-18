import {
  useEndpointSelectedStateStore,
  useGraphQLExplorerPageStore,
} from '@/stores'

export const useExplorerService = () => {
  const response = useGraphQLExplorerPageStore((state) => state.response)
  const currentPageSelectedEndpoint = useEndpointSelectedStateStore(
    (state) => state.currentPageSelectedEndpoint
  )
  const pageLoadState = useGraphQLExplorerPageStore(
    (state) => state.pageLoadState
  )

  return { response, pageLoadState, currentPageSelectedEndpoint }
}
