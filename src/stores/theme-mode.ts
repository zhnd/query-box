import { SettingsBridge } from '@/bridges'
import { create } from 'zustand'
import { persist, StorageValue } from 'zustand/middleware'

const PERSIST_KEY = 'ui.theme.mode'
export type ThemeMode = 'dark' | 'light' | 'system'

interface ThemeModeStoreState {
  themeMode: ThemeMode
}

interface ThemeModeStoreActions {
  setThemeMode: (themeMode: ThemeMode) => void
}

type ThemeModeStore = ThemeModeStoreState & ThemeModeStoreActions

const getItem = async (name: string) => {
  try {
    const item = await SettingsBridge.getSetting(name)
    return {
      state: {
        themeMode: item?.value as ThemeMode,
      },
    }
  } catch (error) {
    console.error('Failed to get theme item:', error)
    return null
  }
}

const setItem = async (
  name: string,
  value: StorageValue<ThemeModeStoreState>
) => {
  try {
    await SettingsBridge.upsertSetting(name, value.state.themeMode, {
      value_type: 'string',
      category: 'theme',
      description: 'The current theme of the application',
    })
  } catch (error) {
    console.error('Failed to set theme item:', error)
  }
}

const removeItem = async (name: string) => {
  try {
    await SettingsBridge.removeSetting(name)
  } catch (error) {
    console.error('Failed to remove theme item:', error)
  }
}

function syncThemeModeToDom(theme: ThemeMode) {
  const root = window.document.documentElement
  root.classList.remove('light', 'dark')

  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light'
    root.classList.add(systemTheme)
    return systemTheme
  }

  root.classList.add(theme)
}

export const useThemeModeStore = create<ThemeModeStore>()(
  persist(
    (set) => ({
      themeMode: 'system',
      setThemeMode: (themeMode: ThemeMode) => {
        set({ themeMode })
        syncThemeModeToDom(themeMode)
      },
    }),
    {
      name: PERSIST_KEY,
      storage: {
        getItem,
        setItem,
        removeItem,
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          syncThemeModeToDom(state.themeMode)
        }
      },
    }
  )
)

export default useThemeModeStore
