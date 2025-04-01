import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { JsonViewer } from '../json-viewer'
import { ResponseViewType, viewLabels, ViewTypeMenuItems } from './constants'
import { useResponseViewerService } from './use-service'

export function ResponseViewer() {
  const service = useResponseViewerService()

  return (
    <div className="flex-1 h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              {viewLabels[service.activeView]}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {ViewTypeMenuItems.map((item) => (
              <DropdownMenuItem
                key={item.value}
                onClick={() => service.setActiveView(item.value)}
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 overflow-auto">
        {service.activeView === ResponseViewType.BODY ? (
          <JsonViewer />
        ) : (
          <JsonViewer />
        )}
      </div>
    </div>
  )
}
