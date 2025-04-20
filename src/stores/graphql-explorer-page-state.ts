import { RequestHistory } from '@/generated/typeshare-types'
import { create } from 'zustand'

interface GraphQLExplorerPageState {
  query: string
  variables: string
  response: string
  requestHistories: RequestHistory[]
  activeRequestHistory: RequestHistory | null
}

interface GraphQLExplorerPageActions {
  setQuery: (query: string) => void
  setVariables: (variables: string) => void
  setResponse: (response: string) => void
  setRequestHistories: (histories: RequestHistory[]) => void
  setActiveRequestHistory: (requestHistory: RequestHistory | null) => void
}
type GraphQLExplorerPageStore = GraphQLExplorerPageState &
  GraphQLExplorerPageActions

export const useGraphQLExplorerPageStore = create<GraphQLExplorerPageStore>()(
  (set) => ({
    requestHistories: [],
    activeRequestHistory: null,
    query: '',
    variables: '',
    response: '',
    setQuery: (query) => set(() => ({ query })),
    setVariables: (variables) => set(() => ({ variables })),
    setResponse: (response) => set(() => ({ response })),
    setRequestHistories: (histories) =>
      set(() => ({ requestHistories: histories })),
    setActiveRequestHistory: (requestHistory) =>
      set(() => ({ activeRequestHistory: requestHistory })),
  })
)
