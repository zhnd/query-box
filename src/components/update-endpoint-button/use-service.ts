import { useEndpointPageStore } from '@/stores'

export const useUpdateEndpointButtonService = () => {
  const setUpdateDialogOpen = useEndpointPageStore(
    (state) => state.setUpdateDialogOpen
  )

  const handleUpdateEndpoint = () => {
    setUpdateDialogOpen(true)
  }

  return {
    handleUpdateEndpoint,
  }
}
