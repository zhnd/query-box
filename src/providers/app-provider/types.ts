import { AppSidebarKeys } from '@/modules/query-box-app/types'
import { GraphQLSchema } from 'graphql'
import { ReactNode } from 'react'

export type AppGlobalState = {
  schema: GraphQLSchema | null
  app: {
    activeAppSidebarMenuItemKey: AppSidebarKeys | null
    endpointId: string | null
  }
}

export type AppProviderProps = {
  children: ReactNode
}

export const initialAppGlobalState: AppGlobalState = {
  schema: null,
  app: {
    activeAppSidebarMenuItemKey: null,
    endpointId: null,
  },
}

export type AppAction =
  | { type: 'reset' }
  | { type: 'upsertSchema'; value: AppGlobalState['schema'] }
  | { type: 'setActiveAppSidebarMenuItemKey'; value: AppSidebarKeys | null }
  | { type: 'setEndpointId'; value: string | null }

export type AppProviderState = {
  state: AppGlobalState
  dispatch: (action: AppAction) => void
}
