import type { ReactNode } from 'react'
import { NavbarKeys } from '../../types'

export type NavbarItem = {
  key: NavbarKeys
  label: string
  icon: ReactNode
}
