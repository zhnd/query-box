import { AppSidebarMenuItemKeys } from '@/constants'
import { JSX } from 'react'

export type AppSidebarItem = {
  key: AppSidebarMenuItemKeys
  title: string
  icon: JSX.Element
}

export type MenuItemProps = {
  item: AppSidebarItem
  activeKey: AppSidebarMenuItemKeys | null
  onClick: (key: AppSidebarMenuItemKeys) => void
}
