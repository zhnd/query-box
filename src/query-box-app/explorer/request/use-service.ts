import { GraphQLBridge } from '@/bridges'
import {
  useEndpointSelectedStateStore,
  useGraphQLExplorerPageStore,
} from '@/stores'
import { useMutation } from '@tanstack/react-query'

export const useRequestService = () => {
  const setQuery = useGraphQLExplorerPageStore((state) => state.setQuery)
  const setResponse = useGraphQLExplorerPageStore((state) => state.setResponse)
  const query = useGraphQLExplorerPageStore((state) => state.query)
  const currentPageSelectedEndpoint = useEndpointSelectedStateStore(
    (state) => state.currentPageSelectedEndpoint
  )

  const { mutate, isPending } = useMutation({
    mutationFn: GraphQLBridge.send_graphql_request,
    onSuccess: (data) => {
      setResponse(data)
    },
  })

  const request = async () => {
    mutate({
      endpoint: currentPageSelectedEndpoint?.url ?? '',
      query,
    })
  }

  return {
    request,
    setQuery,
    isPending,
  }
}
