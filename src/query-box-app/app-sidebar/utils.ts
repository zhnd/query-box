import { AppSidebarMenuItemKeys } from '@/constants'
import { appSidebarMenuItems } from './constants'
import { AppSidebarItem } from './types'

export const getAppSidebarMenuItem = (params: {
  key: AppSidebarMenuItemKeys | null
}): AppSidebarItem | undefined => {
  const { key } = params
  return appSidebarMenuItems.find((item) => item.key === key)
}
