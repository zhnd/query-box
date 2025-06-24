import { EndpointBridge } from '@/bridges'
import { Endpoint } from '@/generated/typeshare-types'
import { useEndpointPageStore } from '@/stores'
import { useQuery } from '@tanstack/react-query'
import { PaginationState } from '@tanstack/react-table'
import { useEffect, useState } from 'react'

interface EndpointListParams {
  pagination: PaginationState
  searchQuery?: {
    filterString?: string
  }
}

export const useEndpointListService = () => {
  const [listParams, setListParams] = useState<EndpointListParams>({
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
  })

  const searchQuery = useEndpointPageStore((state) => state.searchQuery)

  const { data } = useQuery({
    queryKey: ['endpoints', listParams],
    queryFn: () =>
      EndpointBridge.listEndpoints({
        pagination: {
          page: listParams.pagination.pageIndex + 1,
          per_page: listParams.pagination.pageSize,
        },
        name: listParams.searchQuery?.filterString,
      }),
  })

  useEffect(() => {
    setListParams((prev) => ({
      ...prev,
      searchQuery,
      pagination: {
        ...prev.pagination,
        pageIndex: 0, // Reset to first page when search query changes
      },
    }))
  }, [searchQuery])

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

  const onPaginationChange = (pagination: PaginationState) => {
    setListParams((prev) => ({
      ...prev,
      pagination,
    }))
  }

  return {
    endpointsInfo: data,
    pagination: listParams.pagination,
    onPaginationChange,
    openUpdateDialog,
    openDeleteDialog,
  }
}
