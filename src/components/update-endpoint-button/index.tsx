import { UpdateEndpoint } from '@/query-box-app/endpoint/update'
import { SquarePen } from 'lucide-react'
import { EditButton } from '../buttons/edit-button'
import { useUpdateEndpointButtonService } from './use-service'

interface UpdateEndpointButtonProps {
  endpointId: string
  onUpdateSuccess?: () => void
  onUpdateError?: (error: Error) => void
}

export function UpdateEndpointButton(props: UpdateEndpointButtonProps) {
  const { endpointId, onUpdateSuccess, onUpdateError } = props
  const service = useUpdateEndpointButtonService()
  return (
    <>
      <EditButton variant="outline" onClick={service.handleUpdateEndpoint}>
        <SquarePen />
      </EditButton>
      <UpdateEndpoint
        endpointId={endpointId}
        onUpdateSuccess={onUpdateSuccess}
        onUpdateError={onUpdateError}
      />
    </>
  )
}
