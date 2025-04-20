import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { ChevronRight, MoreHorizontal, Plus, X } from 'lucide-react'
import { useRequestHistoryTabsService } from './use-service'

export function RequestHistoryTabs() {
  const service = useRequestHistoryTabsService()

  return (
    <div className="tab-bar flex flex-row gap-2 items-center border-b">
      <div
        className="flex-1 flex space-x-4 min-w-0 overflow-x-auto scrollbar-hide"
        ref={service.tabsContainerRef}
      >
        {service.requestHistories.map((record, index) => (
          <div
            key={record.id}
            data-tab-id={record.id}
            onClick={() => {
              service.handleActiveTabChange(record.id)
            }}
            className={cn(
              'flex items-center shrink-0 cursor-pointer gap-2 group p-1 box-border border-b-2 border-transparent hover:border-b-primary',
              service.activeRequestHistory?.id === record.id
                ? 'border-b-primary'
                : ''
            )}
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
      <div>
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
            {service.requestHistories.map((record) => (
              <DropdownMenuItem
                key={record.id}
                onClick={() => service.handleActiveTabChange(record.id)}
              >
                {record.name}
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
