import { CreateButton } from '@/components/buttons'
import { Input } from '@/components/ui/input'
import { useFunctionSearchService } from './use-service'

export function SearchFunction() {
  const service = useFunctionSearchService()
  return (
    <div className="pb-2 flex justify-between items-center">
      <Input
        placeholder="Filter functions..."
        className="max-w-sm"
        onChange={service.handleSearchQueryStringOnChange}
      />
      <CreateButton onClick={service.openCreateDialog} />
    </div>
  )
}
