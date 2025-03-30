import { useAppSidebarMenuStore } from '@/stores'

export const useAppService = () => {
  const { activeItemKey } = useAppSidebarMenuStore()
  return {
    activeAppSidebarMenuItem: activeItemKey,
  }
}
