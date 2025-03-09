import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'dark' | 'light' | 'system'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

function syncThemeToDom(theme: Theme) {
  const root = window.document.documentElement
  root.classList.remove('light', 'dark')

  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light'
    root.classList.add(systemTheme)
    return
  }

  root.classList.add(theme)
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system' as Theme,
      setTheme: (theme: Theme) => {
        set({ theme })
        syncThemeToDom(theme)
      },
    }),
    {
      name: 'ui-theme',
      onRehydrateStorage: () => {
        return (rehydratedState) => {
          if (rehydratedState) {
            syncThemeToDom(rehydratedState.theme)
          }
        }
      },
    }
  )
)

export default useThemeStore
