import { RequestHistory } from '@/generated/typeshare-types'
import { create } from 'zustand'

interface GraphQLExplorerPageState {
  response: string
  requestHistories: RequestHistory[]
  activeRequestHistory: RequestHistory | null
}

interface GraphQLExplorerPageActions {
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
    response: '',
    setResponse: (response) => set(() => ({ response })),
    setRequestHistories: (histories) =>
      set(() => ({ requestHistories: histories })),
    setActiveRequestHistory: (requestHistory) =>
      set(() => ({ activeRequestHistory: requestHistory })),
  })
)
