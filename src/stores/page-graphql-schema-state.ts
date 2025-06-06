import { GraphQLSchema } from 'graphql'
import { create } from 'zustand'

interface GraphQLSchemaStoreState {
  schema: GraphQLSchema | null
  loading: boolean
  error: string | null
  lastFetchTime?: number
}

interface GraphQLSchemaStoreActions {
  setSchema: (schema: GraphQLSchema | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setLastFetchTime: (lastFetchTime?: number) => void
}

type GraphQLSchemaStore = GraphQLSchemaStoreState & GraphQLSchemaStoreActions

export const usePageGraphQLSchemaStore = create<GraphQLSchemaStore>((set) => ({
  schema: null,
  loading: false,
  error: null,
  lastFetchTime: undefined,

  setSchema: (schema) => set({ schema }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setLastFetchTime: (lastFetchTime) => set({ lastFetchTime }),
}))
