import { useEndpointPageStore } from '@/stores'

export const useEndpointPageService = () => {
  const operateEndpoint = useEndpointPageStore((state) => state.operateEndpoint)

  return {
    operateEndpoint,
  }
}
