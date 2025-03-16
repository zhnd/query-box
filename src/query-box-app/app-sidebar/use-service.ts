import { useSidebar } from '@/components/ui/sidebar'
import { useAppContext } from '@/providers'
import { useAppSidebarCollapsedStore } from '@/stores'
import { useEffect, useRef } from 'react'
import { AppSidebarKeys } from '../types'

export const useAppSidebarService = () => {
  const {
    state: {
      app: { activeAppSidebarMenuItemKey },
    },
    dispatch,
  } = useAppContext()
  const updatedFromStoreRef = useRef(false)
  const { state, setOpen } = useSidebar()

  const { appSidebarCollapsed, setAppSidebarCollapsed } =
    useAppSidebarCollapsedStore()

  const updateActiveAppSidebarMenuItemKey = (key: AppSidebarKeys) => {
    dispatch({ type: 'setActiveAppSidebarMenuItemKey', value: key })
  }

  useEffect(() => {
    if (updatedFromStoreRef.current) {
      setAppSidebarCollapsed(state === 'collapsed')
    }
  }, [state])

  useEffect(() => {
    if (updatedFromStoreRef.current) return

    setOpen(appSidebarCollapsed ? false : true)
    updatedFromStoreRef.current = true

    return () => {
      updatedFromStoreRef.current = false
    }
  }, [appSidebarCollapsed])

  return {
    activeAppSidebarMenuItemKey,
    updateActiveAppSidebarMenuItemKey,
  }
}
