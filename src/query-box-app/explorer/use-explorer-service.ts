import { useGraphQLExplorerPageStore } from '@/stores'

export const useExplorerService = () => {
  const response = useGraphQLExplorerPageStore((state) => state.response)
  const pageLoadState = useGraphQLExplorerPageStore(
    (state) => state.pageLoadState
  )

  return { response, pageLoadState }
}
