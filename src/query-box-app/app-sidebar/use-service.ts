import { useSidebar } from '@/components/ui/sidebar'
import { AppSidebarMenuItemKeys } from '@/constants'
import {
  useAppSidebarCollapsedStore,
  useAppSidebarMenuStore,
  useEndpointSelectedStateStore,
} from '@/stores'
import { useEffect, useRef } from 'react'

export const useAppSidebarService = () => {
  const updatedFromStoreRef = useRef(false)
  const { state, setOpen } = useSidebar()

  const { appSidebarCollapsed, setAppSidebarCollapsed } =
    useAppSidebarCollapsedStore()

  const { activeItemKey, setActiveItemKey } = useAppSidebarMenuStore()
  const resetCurrentPageSelectedEndpoint = useEndpointSelectedStateStore(
    (state) => state.resetCurrentPageSelectedEndpoint
  )

  const updateActiveAppSidebarMenuItemKey = (key: AppSidebarMenuItemKeys) => {
    setActiveItemKey(key)
    if (key !== activeItemKey) {
      resetCurrentPageSelectedEndpoint()
    }
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
    activeItemKey,
    updateActiveAppSidebarMenuItemKey,
  }
}
