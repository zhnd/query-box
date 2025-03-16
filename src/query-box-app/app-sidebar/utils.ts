import { AppSidebarKeys } from '../types'
import { appSidebarMenuItems } from './constants'
import { AppSidebarItem } from './types'

export const getAppSidebarMenuItem = (params: {
  key: AppSidebarKeys | null
}): AppSidebarItem | undefined => {
  const { key } = params
  return appSidebarMenuItems.find((item) => item.key === key)
}
