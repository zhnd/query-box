import { SettingsBridge } from '@/bridges'
import { SettingsKeys, SettingsKeysType } from '@/constants'
import {
  SettingsCategories,
  SettingsValueTypes,
  UIResolvedUIThemeMode,
  UIThemeMode,
} from '@/types'
import { create } from 'zustand'
import { persist, StorageValue } from 'zustand/middleware'

interface ThemeModeStoreState {
  themeMode: UIThemeMode
  resolvedThemeMode: UIResolvedUIThemeMode
}

interface ThemeModeStoreActions {
  setThemeMode: (themeMode: UIThemeMode) => void
}

type ThemeModeStore = ThemeModeStoreState & ThemeModeStoreActions

const getItem = async (name: string) => {
  try {
    const item = await SettingsBridge.getSetting(name as SettingsKeysType)
    return {
      state: {
        themeMode: item?.value as UIThemeMode,
        resolvedThemeMode: item?.value as UIResolvedUIThemeMode,
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
    await SettingsBridge.upsertSetting(
      name as SettingsKeysType,
      value.state.themeMode,
      {
        value_type: SettingsValueTypes.STRING,
        category: SettingsCategories.UI_THEME,
        description: 'The current theme of the application',
      }
    )
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

const setupSystemThemeListener = () => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  const handleChange = () => {
    const currentTheme = useThemeModeStore.getState().themeMode
    if (currentTheme === 'system') {
      const { resolvedThemeMode } = syncThemeModeToDom('system')
      useThemeModeStore.setState({ resolvedThemeMode })
    }
  }

  mediaQuery.addEventListener('change', handleChange)
  return () => mediaQuery.removeEventListener('change', handleChange)
}

const syncThemeModeToDom = (theme: UIThemeMode) => {
  const root = window.document.documentElement
  root.classList.remove('light', 'dark')

  let resolvedThemeMode: UIResolvedUIThemeMode
  if (theme === 'system') {
    const currentSystemThemeMode = getCurrentSystemThemeMode()
    root.classList.add(currentSystemThemeMode)
    resolvedThemeMode = currentSystemThemeMode
  } else {
    resolvedThemeMode = theme
    root.classList.add(theme)
  }

  return { resolvedThemeMode }
}

export const useThemeModeStore = create<ThemeModeStore>()(
  persist(
    (set) => ({
      themeMode: 'system',
      resolvedThemeMode: 'light',
      setThemeMode: (themeMode: UIThemeMode) => {
        const { resolvedThemeMode } = syncThemeModeToDom(themeMode)
        set({ themeMode, resolvedThemeMode })
      },
    }),
    {
      name: SettingsKeys.UI.THEME.MODE,
      storage: {
        getItem,
        setItem,
        removeItem,
      },
      onRehydrateStorage: () => (state) => {
        setupSystemThemeListener()
        if (state) {
          syncThemeModeToDom(state.themeMode)
        }
      },
    }
  )
)

export const getCurrentSystemThemeMode = (): UIResolvedUIThemeMode => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}
