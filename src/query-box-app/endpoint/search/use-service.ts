import { useEndpointStore } from '@/stores'

export const useEndpointSearchService = () => {
  const setCreateDialogOpen = useEndpointStore(
    (state) => state.setCreateDialogOpen
  )

  const openCreateDialog = () => {
    setCreateDialogOpen(true)
  }

  return {
    openCreateDialog,
  }
}
