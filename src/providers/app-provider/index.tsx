import { createContext, useContext, useReducer } from 'react'
import {
  AppAction,
  AppGlobalState,
  AppProviderProps,
  AppProviderState,
  initialAppGlobalState,
} from './types'

function stateReducer(
  state: AppGlobalState,
  action: AppAction
): AppGlobalState {
  switch (action.type) {
    case 'reset':
      return initialAppGlobalState
    case 'upsertSchema':
      return {
        ...state,
        schema: action.value,
      }
    default:
      throw new Error('Unknown action')
  }
}

const AppProviderContext = createContext<AppProviderState | undefined>(
  undefined
)

export function AppProvider(props: AppProviderProps) {
  const { children } = props
  const [state, dispatch] = useReducer(stateReducer, initialAppGlobalState)

  return (
    <AppProviderContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </AppProviderContext.Provider>
  )
}

export function useAppContext(): AppProviderState {
  const context = useContext(AppProviderContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
