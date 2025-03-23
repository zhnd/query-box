import { CreateEndpoint } from './create'
import { EndpointList } from './list'
import { SearchEndpoint } from './search'

export function Endpoint() {
  return (
    <div>
      <SearchEndpoint />
      <EndpointList />
      <CreateEndpoint />
    </div>
  )
}
