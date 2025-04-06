import { EndpointBridge } from '@/bridges'
import { AppSidebarMenuItemKeys, SettingsKeys } from '@/constants'
import { Endpoint } from '@/generated/typeshare-types'
import { SettingsCategories, SettingsValueTypes } from '@/types'
import _ from 'lodash'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAppSidebarMenuStore } from './app-sidebar-menu'
import { createSettingsStorage } from './storages'

interface setSelectedEndpointParams {
  menuItem: AppSidebarMenuItemKeys
  endpoint: Endpoint | null
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
    (set) => {
      return {
        selectedEndpoints: {},
        currentPageSelectedEndpoint: null,
        setSelectedEndpoint: ({
          menuItem,
          endpoint,
        }: setSelectedEndpointParams) => {
          set((state) => ({
            selectedEndpoints: {
              ...state.selectedEndpoints,
              [menuItem]: endpoint?.id ?? null,
            },
            currentPageSelectedEndpoint: endpoint,
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
      onRehydrateStorage: () => (state) => {
        if (!state) return
        // Rehydrate the current page selected endpoint based on the active menu item
        // and the selected endpoints
        // This is necessary to ensure that the current page selected endpoint is set
        // correctly when the app is rehydrated
        useAppSidebarMenuStore.subscribe(
          (menuState) => menuState.activeItemKey,
          async (activeItemKey) => {
            const currentPageSelectedEndpoint =
              await getCurrentPageSelectedEndpoint({
                activeItemKey: activeItemKey,
                selectedEndpoints: state.selectedEndpoints,
              })

            if (currentPageSelectedEndpoint) {
              useEndpointSelectedStateStore.setState({
                currentPageSelectedEndpoint,
              })
            }
          }
        )
        // Initial fetch for the current page selected endpoint
        const activeItemKey = useAppSidebarMenuStore.getState().activeItemKey
        if (activeItemKey) {
          getCurrentPageSelectedEndpoint({
            activeItemKey,
            selectedEndpoints: state.selectedEndpoints,
          }).then((endpoint) => {
            if (endpoint) {
              useEndpointSelectedStateStore.setState({
                currentPageSelectedEndpoint: endpoint,
              })
            }
          })
        }
      },
    }
  )
)

const getCurrentPageSelectedEndpoint = async (params: {
  activeItemKey: AppSidebarMenuItemKeys
  selectedEndpoints: Record<string, string | null>
}) => {
  const { activeItemKey, selectedEndpoints } = params

  if (!activeItemKey || _.isEmpty(selectedEndpoints)) return null
  const selectedEndpointId = selectedEndpoints[activeItemKey]

  // if no endpointId is selected, fetch the first endpoint from the list
  return selectedEndpointId
    ? await fetchEndpointById(selectedEndpointId)
    : await fetchFallbackEndpoint()
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
