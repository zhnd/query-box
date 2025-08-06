import { AppSidebarMenuItemKeys } from '@/constants'
import { Server, SquareFunction, SquarePlay, Waypoints } from 'lucide-react'
import { AppSidebarItem } from './types'

export const appSidebarMenuItems: Array<AppSidebarItem> = [
  {
    key: AppSidebarMenuItemKeys.ENDPOINT,
    title: 'Endpoint',
    icon: <Server />,
  },
  {
    key: AppSidebarMenuItemKeys.FUNCTION,
    title: 'Function',
    icon: <SquareFunction />,
  },
  {
    key: AppSidebarMenuItemKeys.RESOURCE_TOPOLOGY,
    title: 'Resource Topology',
    icon: <Waypoints />,
  },
  {
    key: AppSidebarMenuItemKeys.EXPLORER,
    title: 'Explorer',
    icon: <SquarePlay />,
  },
]
