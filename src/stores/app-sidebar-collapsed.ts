import { SettingsKeys } from '@/constants'
import { SettingsCategories, SettingsValueTypes } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createSettingsStorage } from './storages'

interface AppSidebarCollapsedStoreState {
  appSidebarCollapsed: boolean
}

interface AppSidebarCollapsedStoreActions {
  setAppSidebarCollapsed: (collapsed: boolean) => void
}

type AppSidebarCollapsedStore = AppSidebarCollapsedStoreState &
  AppSidebarCollapsedStoreActions

export const useAppSidebarCollapsedStore = create<AppSidebarCollapsedStore>()(
  persist(
    (set) => ({
      appSidebarCollapsed: false,
      setAppSidebarCollapsed: (collapsed: boolean) =>
        set({ appSidebarCollapsed: collapsed }),
    }),
    {
      name: SettingsKeys.UI.SIDEBAR.COLLAPSED,
      storage: createSettingsStorage<AppSidebarCollapsedStoreState>({
        valueKey: 'appSidebarCollapsed',
        upsertOptions: {
          value_type: SettingsValueTypes.BOOLEAN,
          category: SettingsCategories.APP_SIDEBAR,
          description: 'App sidebar collapsed status',
        },
      }),
    }
  )
)
