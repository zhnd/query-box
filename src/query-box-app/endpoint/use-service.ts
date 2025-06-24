import { useEndpointPageStore } from '@/stores'
import { useEffect } from 'react'

export const useEndpointPageService = () => {
  const operateEndpoint = useEndpointPageStore((state) => state.operateEndpoint)
  const reset = useEndpointPageStore((state) => state.reset)

  useEffect(() => {
    return () => {
      reset()
    }
  }, [])

  return {
    operateEndpoint,
  }
}
