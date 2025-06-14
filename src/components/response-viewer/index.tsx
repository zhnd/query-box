import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { JsonViewer } from '../json-viewer'
import { RequestStatusIndicator } from './components/request-status-indicator'
import { ResponseViewType, viewLabels, ViewTypeMenuItems } from './constants'
import { ResponseViewerProps, useResponseViewerService } from './use-service'

export function ResponseViewer(props: ResponseViewerProps) {
  const { data } = props
  const service = useResponseViewerService()

  return (
    <div className="flex-1 h-full flex flex-col">
      <div className="px-2 py-1 border-b flex justify-between items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 cursor-pointer"
            >
              {viewLabels[service.activeView]}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {ViewTypeMenuItems.map((item) => (
              <DropdownMenuItem
                key={item.value}
                className="cursor-pointer"
                onClick={() => service.setActiveView(item.value)}
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <RequestStatusIndicator response={data} />
      </div>

      <div className="flex-1 overflow-auto">
        {!data ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No response yet.</p>
            <p>Please send a network request.</p>
          </div>
        ) : service.activeView === ResponseViewType.BODY ? (
          <JsonViewer value={data.body} />
        ) : (
          <JsonViewer value={JSON.stringify(data.headers)} />
        )}
      </div>
    </div>
  )
}
