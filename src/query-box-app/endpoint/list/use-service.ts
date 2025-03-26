import { EndpointBridge } from '@/bridges'
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

  return {
    endpointsInfo: data,
    pagination,
    onPaginationChange: setPagination,
  }
}
