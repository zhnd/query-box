import { SettingsKeys } from '@/constants'
import {
  SettingsCategories,
  SettingsValueTypes,
  UIResolvedUIThemeMode,
  UIThemeMode,
} from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createSettingsStorage } from './storages'

interface ThemeModeStoreState {
  themeMode: UIThemeMode
  resolvedThemeMode: UIResolvedUIThemeMode
}

interface ThemeModeStoreActions {
  setThemeMode: (themeMode: UIThemeMode) => void
}

type ThemeModeStore = ThemeModeStoreState & ThemeModeStoreActions

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
      storage: createSettingsStorage<ThemeModeStoreState>({
        valueKey: 'themeMode',
        upsertOptions: {
          value_type: SettingsValueTypes.STRING,
          category: SettingsCategories.UI_THEME,
          description: 'Application theme mode (light/dark/system)',
        },
      }),
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
