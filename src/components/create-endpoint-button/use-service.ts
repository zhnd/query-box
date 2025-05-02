import { Endpoint } from '@/generated/typeshare-types'
import {
  useAppSidebarMenuStore,
  useEndpointPageStore,
  useEndpointSelectedStateStore,
} from '@/stores'

export const useCreateEndpointButtonService = () => {
  const setCreateDialogOpen = useEndpointPageStore(
    (state) => state.setCreateDialogOpen
  )

  const activeItemKey = useAppSidebarMenuStore((state) => state.activeItemKey)

  const setSelectedEndpoint = useEndpointSelectedStateStore(
    (state) => state.setSelectedEndpoint
  )

  const handleCreateEndpoint = () => {
    setCreateDialogOpen(true)
  }

  const onCreateSuccess = (data: { endpoint: Endpoint }) => {
    const { endpoint } = data
    setSelectedEndpoint({
      menuItem: activeItemKey,
      endpoint: endpoint,
    })
  }

  return {
    handleCreateEndpoint,
    onCreateSuccess,
  }
}
