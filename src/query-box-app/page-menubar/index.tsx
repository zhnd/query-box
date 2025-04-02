import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { ThemeModeToggle } from '../theme-mode-toggle'
import { usePageMenubarService } from './use-service'

export function PageMenubar() {
  const service = usePageMenubarService()
  return (
    <div className="w-full border-alpha-200 flex h-16 items-center justify-between gap-2 border-b p-4 md:h-12">
      {Boolean(service.activeAppSidebarMenuItem) && (
        <div className="flex-1 flex items-center flex-nowrap overflow-y-auto">
          <span className="text-gray-500">
            {service.activeAppSidebarMenuItem?.title}
          </span>
          {service.showEndpointSelector && (
            <>
              <span className="px-1 text-gray-500">/</span>
              <Popover
                open={service.popoverOpen}
                onOpenChange={service.updatePopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-64 justify-between">
                    {service.selectedEndpoint
                      ? service.selectedEndpoint.name
                      : 'Select Endpoint'}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0">
                  <Command>
                    <CommandInput placeholder="Search endpoint..." />
                    <CommandList>
                      <CommandEmpty>No endpoints found</CommandEmpty>

                      <CommandGroup>
                        {service.endpoints.map((endpoint) => (
                          <CommandItem
                            key={endpoint.id}
                            value={endpoint.id}
                            title={endpoint.name}
                            onSelect={(currentValue) => {
                              service.updateEndpointId(currentValue)
                            }}
                          >
                            <span className="truncate block">
                              {endpoint.name}
                            </span>
                            <Check
                              className={cn(
                                'ml-auto',
                                service.selectedEndpoint?.id === endpoint.id
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </>
          )}
        </div>
      )}
      <div className="ml-auto">
        <ThemeModeToggle />
      </div>
    </div>
  )
}
