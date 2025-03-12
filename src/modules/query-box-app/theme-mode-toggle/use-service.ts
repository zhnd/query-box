import { useThemeModeStore } from '@/stores'

export const useThemeModeToggleService = () => {
  const { themeMode, setThemeMode } = useThemeModeStore()
  const toggleTheme = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light')
  }

  return {
    toggleTheme,
  }
}
