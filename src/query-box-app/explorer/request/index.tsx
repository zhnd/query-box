import { QueryEditor } from '@/components/query-editor'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useRequestService } from './use-service'

export function Request() {
  const service = useRequestService()
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-2 py-1 border-b">
        <div className="flex items-center text-sm font-medium">Operation</div>

        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={service.request}
          disabled={service.isPending}
        >
          {service.isPending ? <Loader2 className="animate-spin" /> : null}
          Run
        </Button>
      </div>
      <QueryEditor onChange={service.setQuery} />
    </div>
  )
}
