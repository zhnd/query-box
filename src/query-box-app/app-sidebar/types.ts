import { JSX } from 'react'
import { AppSidebarKeys } from '../types'

export type AppSidebarItem = {
  key: AppSidebarKeys
  title: string
  icon: JSX.Element
}

export type MenuItemProps = {
  item: AppSidebarItem
  activeKey: AppSidebarKeys | null
  onClick: (key: AppSidebarKeys) => void
}
