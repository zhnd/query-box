import { AppSidebarMenuItemKeys } from '@/constants'
import { useAppContext } from '@/providers'
import { useAppSidebarMenuStore } from '@/stores'
import { useState } from 'react'
import { getAppSidebarMenuItem } from '../app-sidebar/utils'

export const usePageMenubarService = () => {
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false)
  const {
    state: {
      app: { endpointId },
    },
    dispatch,
  } = useAppContext()

  const { activeItemKey } = useAppSidebarMenuStore()

  const activeAppSidebarMenuItem = getAppSidebarMenuItem({
    key: activeItemKey,
  })

  const showEndpointSelector =
    activeAppSidebarMenuItem?.key !== AppSidebarMenuItemKeys.ENDPOINT

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
    showEndpointSelector,
  }
}
