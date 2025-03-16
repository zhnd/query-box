import { useAppContext } from '@/providers'
import { useState } from 'react'
import { getAppSidebarMenuItem } from '../app-sidebar/utils'

export const usePageMenubarService = () => {
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false)
  const {
    state: {
      app: { activeAppSidebarMenuItemKey, endpointId },
    },
    dispatch,
  } = useAppContext()
  const activeAppSidebarMenuItem = getAppSidebarMenuItem({
    key: activeAppSidebarMenuItemKey,
  })

  const updateEndpointId = (value: string | null) => {
    dispatch({ type: 'setEndpointId', value })
    setPopoverOpen(false)
  }

  const updatePopoverOpen = (value: boolean) => {
    setPopoverOpen(value)
  }

  return {
    activeAppSidebarMenuItem,
    endpointId,
    updateEndpointId,
    updatePopoverOpen,
    popoverOpen,
  }
}
