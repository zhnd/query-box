import { useAppContext } from '@/providers'
import { AppSidebarKeys } from '../types'

export const useAppSidebarService = () => {
  const {
    state: {
      app: { activeAppSidebarMenuItemKey },
    },
    dispatch,
  } = useAppContext()

  const updateActiveAppSidebarMenuItemKey = (key: AppSidebarKeys) => {
    dispatch({ type: 'setActiveAppSidebarMenuItemKey', value: key })
  }

  return {
    activeAppSidebarMenuItemKey,
    updateActiveAppSidebarMenuItemKey,
  }
}
