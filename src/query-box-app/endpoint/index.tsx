import { useEndpointService } from './use-service'

export function Endpoint() {
  useEndpointService()
  return (
    <div>
      <h1>Endpoint</h1>
    </div>
  )
}
