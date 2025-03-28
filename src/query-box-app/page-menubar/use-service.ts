import { EndpointBridge } from '@/bridges'
import { AppSidebarMenuItemKeys } from '@/constants'
import { useAppContext } from '@/providers'
import { useAppSidebarMenuStore } from '@/stores'
import { useQuery } from '@tanstack/react-query'
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
    (endpoint) => endpoint.id === endpointId
  )

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
    endpoints: endpointsData?.items || [],
    selectedEndpoint,
  }
}
