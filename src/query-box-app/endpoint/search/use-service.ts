import { useEndpointPageStore } from '@/stores'

export const useEndpointSearchService = () => {
  const setCreateDialogOpen = useEndpointPageStore(
    (state) => state.setCreateDialogOpen
  )

  const openCreateDialog = () => {
    setCreateDialogOpen(true)
  }

  return {
    openCreateDialog,
  }
}
