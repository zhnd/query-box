import { CreateEndpoint } from './create'
import { DeleteEndpoint } from './delete'
import { EndpointList } from './list'
import { SearchEndpoint } from './search'
import { UpdateEndpoint } from './update'
import { useEndpointPageService } from './use-service'

export function Endpoint() {
  const service = useEndpointPageService()
  return (
    <div className="endpoint">
      <SearchEndpoint />
      <EndpointList />
      <CreateEndpoint />
      {service.operateEndpoint?.id ? (
        <UpdateEndpoint endpointId={service.operateEndpoint.id} />
      ) : null}
      <DeleteEndpoint />
    </div>
  )
}
