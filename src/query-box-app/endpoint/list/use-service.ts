import { Endpoint, PaginatedResponse } from '@/generated/typeshare-types'
import { PaginationState } from '@tanstack/react-table'
import { invoke } from '@tauri-apps/api/core'
import { useEffect, useState } from 'react'

export const useEndpointListService = () => {
  const [endpointsInfo, setEndpointsInfo] =
    useState<PaginatedResponse<Endpoint> | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const getData = async () => {
    console.log('Getting all endpoints...')
    try {
      const data = await invoke<PaginatedResponse<Endpoint>>(
        'get_all_endpoints',
        {
          filter: {
            pagination: {},
          },
        }
      )
      console.log('Data:', data)
      setEndpointsInfo(data)
      return data
    } catch (error) {
      console.error('Error updating setting:', error)
      throw error
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return {
    endpointsInfo,
    pagination,
    onPaginationChange: setPagination,
  }
}
