import { RequestHistory } from '@/generated/typeshare-types'
import { create } from 'zustand'

interface GraphQLExplorerPageState {
  response: string
  requestHistories: RequestHistory[]
  activeRequestHistory: RequestHistory | null
  viewGraphQLDefinitionFieldType: string | null
}

interface GraphQLExplorerPageActions {
  setResponse: (response: string) => void
  setRequestHistories: (histories: RequestHistory[]) => void
  setActiveRequestHistory: (requestHistory: RequestHistory | null) => void
  setViewGraphQLDefinitionFieldType: (field: string | null) => void
}
type GraphQLExplorerPageStore = GraphQLExplorerPageState &
  GraphQLExplorerPageActions

export const useGraphQLExplorerPageStore = create<GraphQLExplorerPageStore>()(
  (set) => ({
    requestHistories: [],
    activeRequestHistory: null,
    response: '',
    viewGraphQLDefinitionFieldType: null,
    setResponse: (response) => set(() => ({ response })),
    setRequestHistories: (histories) =>
      set(() => ({ requestHistories: histories })),
    setActiveRequestHistory: (requestHistory) =>
      set(() => ({ activeRequestHistory: requestHistory })),
    setViewGraphQLDefinitionFieldType: (field) =>
      set(() => ({ viewGraphQLDefinitionFieldType: field })),
  })
)
