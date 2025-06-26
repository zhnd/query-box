import { SettingsKeys } from '@/constants'
import { SettingsCategories, SettingsValueTypes } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createSettingsStorage } from './storages'

interface ExplorerDocumentationCollapsedState {
  isCollapsed: boolean
}
interface ExplorerDocumentationCollapsedActions {
  setCollapsed: (collapsed: boolean) => void
}
type ExplorerDocumentationCollapsedStore = ExplorerDocumentationCollapsedState &
  ExplorerDocumentationCollapsedActions

export const useExplorerDocumentationCollapsedStore =
  create<ExplorerDocumentationCollapsedStore>()(
    persist<ExplorerDocumentationCollapsedStore>(
      (set) => ({
        isCollapsed: false,
        setCollapsed: (collapsed: boolean) => set({ isCollapsed: collapsed }),
      }),
      {
        name: SettingsKeys.APP_STATE.EXPLORER_DOCUMENTATION_COLLAPSED,
        storage: createSettingsStorage<ExplorerDocumentationCollapsedStore>({
          valueKey: 'isCollapsed',
          upsertOptions: {
            value_type: SettingsValueTypes.BOOLEAN,
            category: SettingsCategories.APP_STATE,
            description: 'Explorer documentation collapsed state',
          },
        }),
      }
    )
  )
