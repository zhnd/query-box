import { JSX } from 'react'
import { AppSidebarKeys } from '../types'

export type AppSidebarItem = {
  key: AppSidebarKeys
  title: string
  icon: JSX.Element
}

export type MenuItemProps = {
  item: AppSidebarItem
}
