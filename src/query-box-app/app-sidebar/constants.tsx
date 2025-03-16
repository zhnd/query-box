import { Link, SquarePlay, Waypoints } from 'lucide-react'
import { AppSidebarItem } from './types'
import { AppSidebarMenuItemKeys } from '@/constants'

export const appSidebarMenuItems: Array<AppSidebarItem> = [
  {
    key: AppSidebarMenuItemKeys.ENDPOINT,
    title: 'Endpoint',
    icon: <Waypoints />,
  },
  {
    key: AppSidebarMenuItemKeys.DOCUMENTATION,
    title: 'Documentation',
    icon: <Link />,
  },
  {
    key: AppSidebarMenuItemKeys.EXPLORER,
    title: 'Explorer',
    icon: <SquarePlay />,
  },
]
