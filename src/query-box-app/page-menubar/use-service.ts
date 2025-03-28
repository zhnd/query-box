import { EndpointBridge } from '@/bridges'
import { AppSidebarMenuItemKeys } from '@/constants'
import { useAppSidebarMenuStore, useEndpointSelectedStateStore } from '@/stores'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getAppSidebarMenuItem } from '../app-sidebar/utils'

export const usePageMenubarService = () => {
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false)

  const { activeItemKey } = useAppSidebarMenuStore()
  const { selectedEndpoints } = useEndpointSelectedStateStore()
  const { setSelectedEndpoint } = useEndpointSelectedStateStore()

  const { data: endpointsData } = useQuery({
    queryKey: ['endpoints'],
    queryFn: () =>
      EndpointBridge.listEndpoints({
        pagination: {
          page: 1,
          per_page: 100,
        },
      }),
  })

  const activeAppSidebarMenuItem = getAppSidebarMenuItem({
    key: activeItemKey,
  })

  const showEndpointSelector =
    activeAppSidebarMenuItem?.key !== AppSidebarMenuItemKeys.ENDPOINT

  const selectedEndpoint = endpointsData?.items.find(
    (endpoint) => endpoint.id === selectedEndpoints?.[activeItemKey]
  )

  const updateEndpointId = (value: string) => {
    setSelectedEndpoint({
      menuItem: activeItemKey,
      endpointId: value,
    })
    setPopoverOpen(false)
  }

  const updatePopoverOpen = (value: boolean) => {
    setPopoverOpen(value)
  }
  return {
    activeAppSidebarMenuItem,
    updateEndpointId,
    updatePopoverOpen,
    popoverOpen,
    showEndpointSelector,
    endpoints: endpointsData?.items || [],
    selectedEndpoint,
  }
}
