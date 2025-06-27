import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronRight, MoreHorizontal, Plus } from 'lucide-react'
import { RequestHistoryTabItem } from '../request-history-tab-item'
import { useRequestHistoryTabsService } from './use-service'

export function RequestHistoryTabs() {
  const service = useRequestHistoryTabsService()

  return (
    <div className="tab-bar flex-1 flex flex-row gap-2 items-center">
      <div className="flex-1 flex min-w-0 px-2 bg-muted rounded-lg">
        <div
          className="flex-1 flex space-x-2 min-w-0 w-0 overflow-x-auto scrollbar-hide text-muted-foreground items-center p-1 scroll-px-1"
          ref={service.tabsContainerRef}
        >
          {service.requestHistories.map((record, index) => (
            <RequestHistoryTabItem
              key={record.id}
              requestHistory={record}
              index={index}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 mr-1"
          onClick={service.handleAddRequestHistory}
        >
          <Plus />
          <span className="sr-only">Add tab</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ChevronRight />
              <span className="sr-only">Show all tabs</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {service.requestHistories.map((record, index) => (
              <DropdownMenuItem
                key={record.id}
                onClick={() => service.handleActiveTabChange(record)}
              >
                {record.name ?? `Request ${index + 1}`}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={service.handleDeleteAllRequestHistories}>
              Close all tabs
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
