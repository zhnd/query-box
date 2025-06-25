import { EmptyState } from '@/components/empty-state'
import { ResponseViewer } from '@/components/response-viewer'
import { SplitResizable } from '@/components/split-resizable'
import { Documentation } from './documentation'
import { RequestHistoryTabs } from './history-tabs'
import { Request } from './request'
import { useExplorerService } from './use-explorer-service'

export function Explorer() {
  const service = useExplorerService()

  if (!service.currentPageSelectedEndpoint) {
    return (
      <EmptyState
        title="No endpoint selected"
        description="Select an endpoint to view its schema and send a request."
      />
    )
  }

  return (
    <div className="explorer relative flex-1 flex flex-col">
      <SplitResizable className="flex-1 flex min-h-0" sizes={[30, 70]}>
        <div className="h-full">
          <Documentation />
        </div>
        <div className="flex flex-col h-full">
          <RequestHistoryTabs />

          <SplitResizable className="flex-1 flex min-h-0" sizes={[50, 50]}>
            <div className="h-full">
              <Request />
            </div>
            <div className="h-full">
              <ResponseViewer data={service.response} />
            </div>
          </SplitResizable>
        </div>
      </SplitResizable>
    </div>
  )
}
