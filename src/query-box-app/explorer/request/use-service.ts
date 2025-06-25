import { GraphQLBridge, RequestHistoryBridge } from '@/bridges'
import { useGraphQLSchema } from '@/hooks'
import { getGraphQLRequestHeaders } from '@/lib'
import {
  useEndpointSelectedStateStore,
  useGraphQLExplorerPageStore,
} from '@/stores'
import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'

export const useRequestService = () => {
  const activeRequestHistory = useGraphQLExplorerPageStore(
    (state) => state.activeRequestHistory
  )

  const setActiveRequestHistory = useGraphQLExplorerPageStore(
    (state) => state.setActiveRequestHistory
  )

  const setRequestHistories = useGraphQLExplorerPageStore(
    (state) => state.setRequestHistories
  )

  const setResponse = useGraphQLExplorerPageStore((state) => state.setResponse)

  const setViewGraphQLDefinitionFieldType = useGraphQLExplorerPageStore(
    (state) => state.setViewGraphQLDefinitionFieldType
  )

  // Get the currently selected endpoint for the current page
  // This is used to send the GraphQL request
  // and to fetch the schema for the current endpoint
  const currentPageSelectedEndpoint = useEndpointSelectedStateStore(
    (state) => state.currentPageSelectedEndpoint
  )
  // Fetch the GraphQL schema for the current endpoint
  const { schema } = useGraphQLSchema({
    endpoint: currentPageSelectedEndpoint,
  })

  useEffect(() => {
    setResponse(null)
  }, [currentPageSelectedEndpoint])

  const { mutate, isPending } = useMutation({
    mutationFn: GraphQLBridge.send_graphql_request,
    onSuccess: (data) => {
      setResponse(data)
    },
    onError: (error) => {
      toast.error('Request failed: ', {
        description: error instanceof Error ? error.message : String(error),
      })
    },
  })

  const {
    mutate: updateRequestHistoryMutate,
    isPending: isRequestHistoryUpdating,
  } = useMutation({
    mutationFn: RequestHistoryBridge.updateRequestHistory,
    onSuccess: (data) => {
      setActiveRequestHistory(data)

      const requestHistories = useGraphQLExplorerPageStore
        .getState()
        .requestHistories.map((item) => {
          if (item.id === data.id) {
            return {
              ...item,
              query: data.query,
            }
          }
          return item
        })

      setRequestHistories(requestHistories)
    },
  })

  const handleQueryUpdate = (query: string) => {
    // monaco editor will trigger this function when the query is updated
    // QueryEditor props.onChange function has been memoized
    // so cannot get the latest state of activeRequestHistory
    // should read latest state from zustand store
    const latestActiveRequestHistory =
      useGraphQLExplorerPageStore.getState().activeRequestHistory
    updateRequestHistoryMutate({
      id: latestActiveRequestHistory?.id ?? '',
      query,
    })
  }

  const handleSendRequest = async () => {
    mutate({
      endpoint: currentPageSelectedEndpoint?.url ?? '',
      query: activeRequestHistory?.query ?? '',
      headers: getGraphQLRequestHeaders({
        endpoint: currentPageSelectedEndpoint,
      }),
    })
  }

  const handleGoToGraphqlFieldDefinition = (field: string) => {
    if (!field) return
    setViewGraphQLDefinitionFieldType(field)
  }

  return {
    schema,
    currentPageSelectedEndpoint,
    isPending: isPending || isRequestHistoryUpdating,
    activeRequestHistory,
    handleSendRequest,
    handleQueryUpdate,
    handleGoToGraphqlFieldDefinition,
  }
}
