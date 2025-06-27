import { RequestHistoryTabItemContent } from '../request-history-tab-item-content'
import {
  RequestHistoryTabItemProps,
  useRequestHistoryTabItemService,
} from './use-service'

export function RequestHistoryTabItem(props: RequestHistoryTabItemProps) {
  const { requestHistory, index } = props
  const service = useRequestHistoryTabItemService(props)
  return (
    <div
      ref={service.tabContainerRef}
      data-tab-id={requestHistory.id}
      data-state={service.isActive ? 'active' : 'inactive'}
      onClick={service.handleActiveTabChange}
      className="cursor-pointer data-[state=active]:bg-background data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
    >
      <RequestHistoryTabItemContent
        index={index}
        requestHistory={requestHistory}
        tabItemScrollIntoView={service.tabItemScrollIntoView}
      />
    </div>
  )
}
