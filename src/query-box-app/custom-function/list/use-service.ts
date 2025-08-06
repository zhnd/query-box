import { CustomFunctionBridge } from '@/bridges'
import { CustomFunction } from '@/generated/typeshare-types'
import { useCustomFunctionPageStore } from '@/stores'
import { useQuery } from '@tanstack/react-query'
import { PaginationState } from '@tanstack/react-table'
import { useEffect, useState } from 'react'

interface FunctionListParams {
  pagination: PaginationState
  searchQuery?: {
    filterString?: string
  }
}

export const useFunctionListService = () => {
  const [listParams, setListParams] = useState<FunctionListParams>({
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
  })

  const searchQuery = useCustomFunctionPageStore((state) => state.searchQuery)

  const { data } = useQuery({
    queryKey: ['endpoints', listParams],
    queryFn: () =>
      CustomFunctionBridge.listCustomFunctions({
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

  const setUpdateDialogOpen = useCustomFunctionPageStore(
    (state) => state.setUpdateDialogOpen
  )

  const setDeleteDialogOpen = useCustomFunctionPageStore(
    (state) => state.setDeleteDialogOpen
  )

  const setOperateFunction = useCustomFunctionPageStore(
    (state) => state.setOperateFunction
  )

  const openUpdateDialog = (data: CustomFunction) => {
    setUpdateDialogOpen(true)
    setOperateFunction(data)
  }

  const openDeleteDialog = (data: CustomFunction) => {
    setDeleteDialogOpen(true)
    setOperateFunction(data)
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
