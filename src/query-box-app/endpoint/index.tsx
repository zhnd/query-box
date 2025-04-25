import { CreateEndpoint } from './create'
import { EndpointList } from './list'
import { SearchEndpoint } from './search'
import { UpdateEndpoint } from './update'

export function Endpoint() {
  return (
    <div className="endpoint">
      <SearchEndpoint />
      <EndpointList />
      <CreateEndpoint />
      <UpdateEndpoint />
    </div>
  )
}
