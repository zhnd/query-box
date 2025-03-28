import { AppSidebarMenuItemKeys, SettingsKeys } from '@/constants'
import { SettingsCategories, SettingsValueTypes } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createSettingsStorage } from './storages'

interface setSelectedEndpointParams {
  menuItem: AppSidebarMenuItemKeys
  endpointId: string
}

interface EndpointSelectedStateStoreState {
  selectedEndpoints: Record<string, string | null> // active menu item key -> endpointId
}

interface EndpointSelectedStateStoreActions {
  setSelectedEndpoint: (params: setSelectedEndpointParams) => void
}
type EndpointStateStore = EndpointSelectedStateStoreState &
  EndpointSelectedStateStoreActions

export const useEndpointSelectedStateStore = create<EndpointStateStore>()(
  persist(
    (set) => ({
      selectedEndpoints: {},
      setSelectedEndpoint: (params: setSelectedEndpointParams) => {
        const { menuItem, endpointId } = params
        set((state) => ({
          selectedEndpoints: {
            ...state.selectedEndpoints,
            [menuItem]: endpointId,
          },
        }))
      },
    }),
    {
      name: SettingsKeys.APP_STATE.SELECTED_ENDPOINT,
      storage: createSettingsStorage<EndpointSelectedStateStoreState>({
        valueKey: 'selectedEndpoints',
        upsertOptions: {
          value_type: SettingsValueTypes.JSON,
          category: SettingsCategories.APP_STATE,
          description: 'Selected endpoint ID in the application state',
        },
      }),
    }
  )
)
