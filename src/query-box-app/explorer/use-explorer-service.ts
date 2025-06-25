import {
  useEndpointSelectedStateStore,
  useGraphQLExplorerPageStore,
} from '@/stores'

export const useExplorerService = () => {
  const response = useGraphQLExplorerPageStore((state) => state.response)
  const currentPageSelectedEndpoint = useEndpointSelectedStateStore(
    (state) => state.currentPageSelectedEndpoint
  )

  return { response, currentPageSelectedEndpoint }
}
