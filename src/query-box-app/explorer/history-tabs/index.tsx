import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronRight, MoreHorizontal, Plus, X } from 'lucide-react'
import { useRequestHistoryTabsService } from './use-service'

export function RequestHistoryTabs() {
  const service = useRequestHistoryTabsService()

  return (
    <div className="tab-bar flex flex-row gap-2 items-center">
      <div
        className="flex-1 flex space-x-4 min-w-0 overflow-x-auto scrollbar-hide bg-muted text-muted-foreground items-center rounded-lg p-1"
        ref={service.tabsContainerRef}
      >
        {service.requestHistories.map((record, index) => (
          <div
            key={record.id}
            data-tab-id={record.id}
            data-state={
              service.activeRequestHistory?.id === record.id
                ? 'active'
                : 'inactive'
            }
            onClick={() => {
              service.handleActiveTabChange(record.id)
            }}
            className="cursor-pointer data-[state=active]:bg-background data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <span className="truncate flex-1 text-xs">
              {record.name ?? `Request ${index + 1}`}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="flex items-center cursor-pointer w-5 h-5"
              onClick={() => service.handleDeleteRequestHistory(record.id)}
            >
              <X />
              <span className="sr-only">Close tab</span>
            </Button>
          </div>
        ))}
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
                onClick={() => service.handleActiveTabChange(record.id)}
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
