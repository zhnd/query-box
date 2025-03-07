import { Link, Waypoints } from 'lucide-react'
import { NavbarKeys } from '../../types'
import { NavbarItem } from './types'

const __ICON_SIZE__ = 16

export const navbarList: Array<NavbarItem> = [
  {
    key: NavbarKeys.ENDPOINT,
    label: 'Endpoint',
    icon: <Waypoints size={__ICON_SIZE__} />,
  },
  {
    key: NavbarKeys.DOCUMENTATION,
    label: 'Documentation',
    icon: <Link size={__ICON_SIZE__} />,
  },
]
