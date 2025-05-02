import { CreateButton } from '@/components/buttons'
import { Input } from '@/components/ui/input'
import { useEndpointSearchService } from './use-service'

export function SearchEndpoint() {
  const service = useEndpointSearchService()
  return (
    <div className="pb-2 flex justify-between items-center">
      <Input placeholder="Filter endpoints..." className="max-w-sm" />
      <CreateButton onClick={service.openCreateDialog} />
    </div>
  )
}
