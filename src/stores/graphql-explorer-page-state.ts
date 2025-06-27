import { RequestHistoryBridge } from '@/bridges'
import { HttpResponse, RequestHistory } from '@/generated/typeshare-types'
import { create } from 'zustand'

interface PageLoadState {
  loading: boolean
  error: string | null
}

interface GraphQLExplorerPageState {
  pageLoadState: PageLoadState
  response: HttpResponse | null
  requestHistories: RequestHistory[]
  activeRequestHistory: RequestHistory | null
  viewGraphQLDefinitionFieldType: string | null
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
  setViewGraphQLDefinitionFieldType: (field: string | null) => void
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
    viewGraphQLDefinitionFieldType: null,
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
    setViewGraphQLDefinitionFieldType: (field) =>
      set(() => ({ viewGraphQLDefinitionFieldType: field })),
  })
)
