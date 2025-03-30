import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { ChevronRight, MoreHorizontal, Plus, X } from 'lucide-react'
import { useTabBarService } from './use-service'

export function TabBar() {
  const service = useTabBarService()

  return (
    <div className="flex-1 flex flex-row gap-2 items-center border-b">
      <div
        className="flex-1 flex space-x-4 min-w-0 overflow-x-auto scrollbar-hide"
        ref={service.tabsContainerRef}
      >
        {service.tabs.map((tab) => (
          <div
            key={tab.id}
            data-tab-id={tab.id}
            onClick={() => {
              service.handleActiveTabChange(tab.id)
            }}
            className={cn(
              'flex items-center shrink-0 cursor-pointer gap-2 group p-2 box-border border-b-2 border-transparent hover:border-b-primary',
              service.activeTabId === tab.id ? 'border-b-primary' : ''
            )}
          >
            <span className="truncate flex-1">{tab.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="flex items-center cursor-pointer w-5 h-5"
              onClick={() => service.removeTab(tab.id)}
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
          className="h-9 w-9 mr-1"
          onClick={service.addTab}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add tab</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Show all tabs</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {service.tabs.map((tab) => (
              <DropdownMenuItem
                key={tab.id}
                onClick={() => service.handleActiveTabChange(tab.id)}
              >
                {tab.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={service.closeAllTabs}>
              Close all tabs
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
