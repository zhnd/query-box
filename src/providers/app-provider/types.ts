import { GraphQLSchema } from 'graphql'
import { ReactNode } from 'react'

export type AppGlobalState = {
  schema: GraphQLSchema | null
}

export type AppProviderProps = {
  children: ReactNode
}

export const initialAppGlobalState: AppGlobalState = {
  schema: null,
}

export type AppAction =
  | { type: 'reset' }
  | { type: 'upsertSchema'; value: AppGlobalState['schema'] }

export type AppProviderState = {
  state: AppGlobalState
  dispatch: (action: AppAction) => void
}
