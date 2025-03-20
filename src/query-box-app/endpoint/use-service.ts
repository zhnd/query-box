import { invoke } from '@tauri-apps/api/core'
import { useEffect } from 'react'

export const useEndpointService = () => {
  const getData = async () => {
    console.log('Getting all endpoints...')
    try {
      const data = await invoke<void>('get_all_endpoints', {
        filter: {
          pagination: {},
        },
      })
      console.log('Data:', data)
    } catch (error) {
      console.error('Error updating setting:', error)
      throw error
    }
  }

  useEffect(() => {
    getData()
  }, [])
  return {
    endpoints: [],
  }
}
