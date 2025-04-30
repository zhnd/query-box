import { EndpointBridge } from '@/bridges'
import { Endpoint } from '@/generated/typeshare-types'
import { useEndpointPageStore } from '@/stores'
import { useQuery } from '@tanstack/react-query'
import { PaginationState } from '@tanstack/react-table'
import { useState } from 'react'

export const useEndpointListService = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const { data } = useQuery({
    queryKey: ['endpoints', pagination],
    queryFn: () =>
      EndpointBridge.listEndpoints({
        pagination: {
          page: pagination.pageIndex + 1,
          per_page: pagination.pageSize,
        },
      }),
  })

  const setUpdateDialogOpen = useEndpointPageStore(
    (state) => state.setUpdateDialogOpen
  )

  const setDeleteDialogOpen = useEndpointPageStore(
    (state) => state.setDeleteDialogOpen
  )

  const setOperateEndpoint = useEndpointPageStore(
    (state) => state.setOperateEndpoint
  )

  const openUpdateDialog = (endpoint: Endpoint) => {
    setUpdateDialogOpen(true)
    setOperateEndpoint(endpoint)
  }

  const openDeleteDialog = (endpoint: Endpoint) => {
    setDeleteDialogOpen(true)
    setOperateEndpoint(endpoint)
  }

  return {
    endpointsInfo: data,
    pagination,
    onPaginationChange: setPagination,
    openUpdateDialog,
    openDeleteDialog,
  }
}
