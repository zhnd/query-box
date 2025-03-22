import { CreateButton } from '@/components/buttons'
import { Input } from '@/components/ui/input'

export function SearchEndpoint() {
  return (
    <div className="pb-2 flex justify-between items-center">
      <Input placeholder="Filter endpoints..." className="max-w-sm" />
      <CreateButton />
    </div>
  )
}
