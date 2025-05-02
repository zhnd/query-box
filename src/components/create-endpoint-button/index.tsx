import { CreateEndpoint } from '@/query-box-app/endpoint/create'
import { Plus } from 'lucide-react'
import { CreateButton } from '../buttons'
import { useCreateEndpointButtonService } from './use-service'

export function CreateEndpointButton() {
  const service = useCreateEndpointButtonService()
  return (
    <>
      <CreateButton variant="outline" onClick={service.handleCreateEndpoint}>
        <Plus />
      </CreateButton>
      <CreateEndpoint onCreateSuccess={service.onCreateSuccess} />
    </>
  )
}
