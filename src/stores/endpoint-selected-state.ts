import { EndpointBridge } from '@/bridges'
import { AppSidebarMenuItemKeys, SettingsKeys } from '@/constants'
import { Endpoint } from '@/generated/typeshare-types'
import { SettingsCategories, SettingsValueTypes } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAppSidebarMenuStore } from './app-sidebar-menu'
import { createSettingsStorage } from './storages'

interface setSelectedEndpointParams {
  menuItem: AppSidebarMenuItemKeys
  endpointId: string
}

interface EndpointSelectedStateStoreState {
  selectedEndpoints: Record<string, string | null> // active menu item key -> endpointId
  currentPageSelectedEndpoint: Endpoint | null
}

interface EndpointSelectedStateStoreActions {
  setSelectedEndpoint: (params: setSelectedEndpointParams) => void
}
type EndpointStateStore = EndpointSelectedStateStoreState &
  EndpointSelectedStateStoreActions

export const useEndpointSelectedStateStore = create<EndpointStateStore>()(
  persist(
    (set, get) => {
      useAppSidebarMenuStore.subscribe(
        (state) => state.activeItemKey,
        async (activeItemKey) => {
          const currentPageSelectedEndpoint =
            await getCurrentPageSelectedEndpoint({
              activeItemKey: activeItemKey,
              selectedEndpoints: get().selectedEndpoints,
            })
          set((prevState) => ({
            ...prevState,
            currentPageSelectedEndpoint,
          }))
        }
      )
      return {
        selectedEndpoints: {},
        currentPageSelectedEndpoint: null,
        setSelectedEndpoint: ({
          menuItem,
          endpointId,
        }: setSelectedEndpointParams) => {
          set((state) => ({
            selectedEndpoints: {
              ...state.selectedEndpoints,
              [menuItem]: endpointId,
            },
          }))
        },
      }
    },
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

const getCurrentPageSelectedEndpoint = async (params: {
  activeItemKey: AppSidebarMenuItemKeys
  selectedEndpoints: Record<string, string | null>
}) => {
  const { activeItemKey, selectedEndpoints } = params
  if (!activeItemKey) return null

  const selectedEndpointId = selectedEndpoints[activeItemKey]
  // if no endpointId is selected, fetch the first endpoint from the list
  return selectedEndpointId
    ? fetchEndpointById(selectedEndpointId)
    : fetchFallbackEndpoint()
}

const fetchFallbackEndpoint = async () => {
  try {
    const endpoints = await EndpointBridge.listEndpoints({
      pagination: { page: 1, per_page: 1 },
    })
    return endpoints.items[0] || null
  } catch (error) {
    console.error('Error fetching fallback endpoint:', error)
    return null
  }
}

const fetchEndpointById = async (endpointId: string) => {
  try {
    return await EndpointBridge.getEndpointById(endpointId)
  } catch (error) {
    console.error('Error fetching endpoint by ID:', error)
    return null
  }
}
