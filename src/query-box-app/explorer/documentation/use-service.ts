import { useEndpointSelectedStateStore } from '@/stores'
import { useEffect } from 'react'
import { fetchDocumentation } from './utils'

export function useService() {
  const selectedEndpoint = useEndpointSelectedStateStore(
    (state) => state.currentPageSelectedEndpoint
  )
  useEffect(() => {
    if (!selectedEndpoint) {
      console.warn('No endpoint selected')
      return
    }
    fetchDocumentation({
      endpointUrl: selectedEndpoint?.url ?? '',
    })
      .then((data) => {
        console.log('Fetched documentation:', data)
      })
      .catch((error) => {
        console.error('Error fetching documentation:', error)
      })
  }, [selectedEndpoint])
}
