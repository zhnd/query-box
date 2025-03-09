import { useThemeStore } from '@/stores'

export const useThemeModeToggleService = () => {
  const { theme, setTheme } = useThemeStore()
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return {
    toggleTheme,
  }
}
