import { GraphQLBridge, RequestHistoryBridge } from '@/bridges'
import {
  QueryEditorCodeLensOperation,
  QueryEditorOnUpdateLensOperationsActionParameters,
} from '@/components/query-editor/types'
import { useGraphQLSchema } from '@/hooks'
import { getGraphQLRequestHeaders } from '@/lib'
import {
  useEndpointSelectedStateStore,
  useGraphQLExplorerPageStore,
} from '@/stores'
import { useMutation } from '@tanstack/react-query'
import { List } from 'immutable'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { RunGraphQLQueryParams } from './types'

export const useRequestService = () => {
  const [codeLensOperations, setCodeLensOperations] = useState<
    QueryEditorCodeLensOperation[]
  >([])

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

  const { mutate: sendGraphQLRequest, isPending } = useMutation({
    mutationFn: GraphQLBridge.send_graphql_request,
    onSuccess: (data) => {
      setResponse(data)
    },
    onError: (error) => {
      toast.error('Request failed: ', {
        description:
          error instanceof Error ? error.message : JSON.stringify(error),
      })
    },
  })

  const {
    mutate: updateRequestHistoryMutate,
    isPending: isRequestHistoryUpdating,
  } = useMutation({
    mutationFn: RequestHistoryBridge.updateRequestHistory,
    onSuccess: (data) => {
      const currentRequestHistories =
        useGraphQLExplorerPageStore.getState().requestHistories

      const currentList = List(currentRequestHistories)
      const targetIndex = currentList.findIndex((item) => item.id === data.id)

      if (targetIndex === -1) return
      const updatedList = currentList.set(targetIndex, data)
      setRequestHistories(updatedList.toArray())
      setActiveRequestHistory({
        requestHistory: data,
        updateActiveBackend: false,
      })
    },
  })

  const handleQueryUpdate = useCallback((query: string) => {
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
  }, [])

  const updateRequestHistoryWithOperationName = useCallback(
    (params?: { name: string }) => {
      const { name } = params || {}
      const latestActiveRequestHistory =
        useGraphQLExplorerPageStore.getState().activeRequestHistory

      /**
       * If the latest active request history is not found or if it is a custom name,
       * we do not update the request history name.
       * This is to prevent overwriting custom names with the default name generated from the query.
       * This is useful when the user has manually set a custom name for the request history.
       */
      if (
        !latestActiveRequestHistory ||
        latestActiveRequestHistory?.is_custom_name
      ) {
        return
      }

      updateRequestHistoryMutate({
        id: latestActiveRequestHistory.id,
        name,
      })
    },
    []
  )

  const handleRunGraphQLQuery = useCallback(
    (params?: RunGraphQLQueryParams) => {
      const { codeString, definitionNameValue } = params ?? {}

      const latestEndpoint =
        useEndpointSelectedStateStore.getState().currentPageSelectedEndpoint
      const latestActiveRequestHistory =
        useGraphQLExplorerPageStore.getState().activeRequestHistory

      /**
       * if current tab just has a operation, get the code string from the active request history
       * otherwise, use the code string from the params
       */
      const codeStringValue = codeString || latestActiveRequestHistory?.query
      // if no endpoint is selected or no code string is provided, do not send the request
      if (!latestEndpoint || !codeStringValue) return

      // Send the GraphQL request using the GraphQLBridge
      sendGraphQLRequest({
        endpoint: latestEndpoint.url ?? '',
        query: codeStringValue,
        headers: getGraphQLRequestHeaders({
          endpoint: latestEndpoint,
        }),
      })

      // Update the request history with the new query
      // This will also update the active request history in the state
      let requestHistoryName = definitionNameValue ?? ''
      if (codeLensOperations.length === 1) {
        requestHistoryName = codeLensOperations[0].definitionNameValue ?? ''
      }
      updateRequestHistoryWithOperationName({
        name: requestHistoryName,
      })
    },
    [sendGraphQLRequest, codeLensOperations]
  )

  const handleGoToGraphqlFieldDefinition = useCallback((field: string) => {
    if (!field) return
    setViewGraphQLDefinitionFieldType(field)
  }, [])

  const handleUpdateCodeLensOperations = useCallback(
    (data: QueryEditorOnUpdateLensOperationsActionParameters) => {
      // Update the code lens operations in the state
      setCodeLensOperations(data.codeLensOperations ?? [])
    },
    []
  )

  return {
    schema,
    codeLensOperations,
    currentPageSelectedEndpoint,
    isPending: isPending || isRequestHistoryUpdating,
    activeRequestHistory,
    handleQueryUpdate,
    handleGoToGraphqlFieldDefinition,
    handleRunGraphQLQuery,
    handleUpdateCodeLensOperations,
  }
}
