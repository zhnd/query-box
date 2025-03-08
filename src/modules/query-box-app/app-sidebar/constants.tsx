import { Link, SquarePlay, Waypoints } from 'lucide-react'
import { AppSidebarKeys } from '../types'
import { AppSidebarItem } from './types'

export const appSidebarMenuItems: Array<AppSidebarItem> = [
  {
    key: AppSidebarKeys.ENDPOINT,
    title: 'Endpoint',
    icon: <Waypoints />,
  },
  {
    key: AppSidebarKeys.DOCUMENTATION,
    title: 'Documentation',
    icon: <Link />,
  },
  {
    key: AppSidebarKeys.EXPLORER,
    title: 'Explorer',
    icon: <SquarePlay />,
  },
]
