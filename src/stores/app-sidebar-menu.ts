import { AppSidebarMenuItemKeys, SettingsKeys } from '@/constants'
import { SettingsCategories, SettingsValueTypes } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createSettingsStorage } from './storages'

interface AppSidebarMenuStoreState {
  activeItemKey: AppSidebarMenuItemKeys
}

interface AppSidebarMenuStoreActions {
  setActiveItemKey: (key: AppSidebarMenuItemKeys) => void
}

type AppSidebarMenuStore = AppSidebarMenuStoreState & AppSidebarMenuStoreActions

export const useAppSidebarMenuStore = create<AppSidebarMenuStore>()(
  persist(
    (set) => ({
      activeItemKey: AppSidebarMenuItemKeys.ENDPOINT,
      setActiveItemKey: (key: AppSidebarMenuItemKeys) =>
        set({ activeItemKey: key }),
    }),
    {
      name: SettingsKeys.UI.SIDEBAR.ACTIVE_ITEM,
      storage: createSettingsStorage<AppSidebarMenuStoreState>({
        upsertOptions: {
          value_type: SettingsValueTypes.JSON,
          category: SettingsCategories.APP_SIDEBAR,
          description: 'Active item key in the app sidebar menu',
        },
      }),
    }
  )
)
