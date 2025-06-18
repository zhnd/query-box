import { useWindowFrontAndFocus } from '@/hooks'
import { useAppSidebarMenuStore } from '@/stores'

export const useAppService = () => {
  useWindowFrontAndFocus()
  const { activeItemKey } = useAppSidebarMenuStore()
  return {
    activeAppSidebarMenuItem: activeItemKey,
  }
}
