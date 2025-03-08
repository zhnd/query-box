import { useTheme } from '@/providers'

export const useThemeModeToggleService = () => {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return {
    toggleTheme,
  }
}
