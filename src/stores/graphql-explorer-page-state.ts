import { RequestHistoryBridge } from '@/bridges'
import { HttpResponse, RequestHistory } from '@/generated/typeshare-types'
import { NavigationStack } from '@/query-box-app/explorer/documentation/types'
import { initializeNavigationStack } from '@/query-box-app/explorer/documentation/utils'
import { OperationTypeNode } from 'graphql'
import { create } from 'zustand'

interface PageLoadState {
  loading: boolean
  error: string | null
}

interface ViewGraphQLDefinitionField {
  name: string
  // The type of field to view in the GraphQL definition
  operationType?: OperationTypeNode
}

interface GraphQLExplorerPageState {
  pageLoadState: PageLoadState
  response: HttpResponse | null
  requestHistories: RequestHistory[]
  activeRequestHistory: RequestHistory | null
  viewGraphQLDefinitionField: ViewGraphQLDefinitionField | null
  navigationStack: NavigationStack
}

interface GraphQLExplorerPageActions {
  setPageLoadState: (state: PageLoadState) => void
  setResponse: (response: HttpResponse | null) => void
  setRequestHistories: (histories: RequestHistory[]) => void
  setActiveRequestHistory: (params: {
    requestHistory: RequestHistory | null
    updateActiveBackend?: boolean
    active?: boolean
  }) => void
  setViewGraphQLDefinitionField: (
    field: ViewGraphQLDefinitionField | null
  ) => void
  setNavigationStack: (stack: NavigationStack) => void
}
type GraphQLExplorerPageStore = GraphQLExplorerPageState &
  GraphQLExplorerPageActions

export const useGraphQLExplorerPageStore = create<GraphQLExplorerPageStore>()(
  (set) => ({
    pageLoadState: {
      loading: true,
      error: null,
    },
    requestHistories: [],
    activeRequestHistory: null,
    response: null,
    viewGraphQLDefinitionField: null,
    navigationStack: initializeNavigationStack(),
    setPageLoadState: (state) =>
      set(() => ({
        pageLoadState: state,
      })),
    setResponse: (response) => set(() => ({ response })),
    setRequestHistories: (histories) =>
      set(() => ({ requestHistories: histories })),
    setActiveRequestHistory: async (params) => {
      const {
        requestHistory,
        active = true,
        updateActiveBackend = true,
      } = params
      set(() => ({ activeRequestHistory: requestHistory }))
      if (!requestHistory || !updateActiveBackend) return
      // Update the active state in the backend
      await RequestHistoryBridge.setActiveRequestHistory({
        id: requestHistory?.id ?? '',
        active,
        endpoint_id: requestHistory?.endpoint_id ?? '',
      })
    },
    setViewGraphQLDefinitionField: (field) =>
      set(() => ({ viewGraphQLDefinitionField: field })),
    setNavigationStack: (stack) =>
      set(() => ({
        navigationStack: stack,
      })),
  })
)
