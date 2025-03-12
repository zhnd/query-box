import { SettingsBridge } from '@/bridges'
import { create } from 'zustand'
import { persist, StorageValue } from 'zustand/middleware'

const PERSIST_KEY = 'ui.theme.mode'
export type ThemeMode = 'dark' | 'light' | 'system'
export type ResolvedThemeMode = 'dark' | 'light'

interface ThemeModeStoreState {
  themeMode: ThemeMode
  resolvedThemeMode: ResolvedThemeMode
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
        resolvedThemeMode: item?.value as ResolvedThemeMode,
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

const syncThemeModeToDom = (theme: ThemeMode) => {
  const root = window.document.documentElement
  root.classList.remove('light', 'dark')

  let resolvedThemeMode: ResolvedThemeMode
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
      setThemeMode: (themeMode: ThemeMode) => {
        const { resolvedThemeMode } = syncThemeModeToDom(themeMode)
        set({ themeMode, resolvedThemeMode })
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
        setupSystemThemeListener()
        if (state) {
          syncThemeModeToDom(state.themeMode)
        }
      },
    }
  )
)

export const getCurrentSystemThemeMode = (): ResolvedThemeMode => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}
