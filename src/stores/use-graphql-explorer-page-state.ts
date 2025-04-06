import { create } from 'zustand'

interface GraphQLExplorerPageState {
  query: string
  variables: string
  response: string
}

interface GraphQLExplorerPageActions {
  setQuery: (query: string) => void
  setVariables: (variables: string) => void
  setResponse: (response: string) => void
}
type GraphQLExplorerPageStore = GraphQLExplorerPageState &
  GraphQLExplorerPageActions

export const useGraphQLExplorerPageStore = create<GraphQLExplorerPageStore>()(
  (set) => ({
    query: '',
    variables: '',
    response: '',
    setQuery: (query) => set(() => ({ query })),
    setVariables: (variables) => set(() => ({ variables })),
    setResponse: (response) => set(() => ({ response })),
  })
)
