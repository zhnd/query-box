import { useThemeModeStore } from '@/stores'

export const useThemeModeToggleService = () => {
  const { resolvedThemeMode, setThemeMode } = useThemeModeStore()
  const toggleTheme = () => {
    setThemeMode(resolvedThemeMode === 'light' ? 'dark' : 'light')
  }

  return {
    toggleTheme,
  }
}
