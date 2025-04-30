import { EndpointBridge } from '@/bridges'
import { useEndpointPageStore } from '@/stores'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useDeleteEndpointService = () => {
  const deleteDialogOpen = useEndpointPageStore(
    (state) => state.deleteDialogOpen
  )
  const setDeleteDialogOpen = useEndpointPageStore(
    (state) => state.setDeleteDialogOpen
  )

  const endpoint = useEndpointPageStore((state) => state.operateEndpoint)
  const setOperateEndpoint = useEndpointPageStore(
    (state) => state.setOperateEndpoint
  )
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: EndpointBridge.deleteEndpoint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['endpoints'] })
      setDeleteDialogOpen(false)
      setOperateEndpoint(null)
    },
  })

  const onSubmit = async () => {
    if (!endpoint?.id) {
      console.error(
        'Invalid endpoint: Cannot delete an undefined or invalid endpoint.'
      )
      return
    }
    mutation.mutate({
      id: endpoint.id,
    })
  }

  return {
    deleteDialogOpen,
    setDeleteDialogOpen,
    onSubmit,
    endpoint,
  }
}
