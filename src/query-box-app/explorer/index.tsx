import { EmptyState } from '@/components/empty-state'
import { ResponseViewer } from '@/components/response-viewer'
import { SplitResizable } from '@/components/split-resizable'
import { Documentation } from './documentation'
import { ToggleDocumentationCollapsedButton } from './documentation/components/toggle-documentation-collapsed'
import { Request } from './request'
import { RequestHistoryTabs } from './request-history-tab-list'
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
      <SplitResizable
        className="flex-1 flex min-h-0"
        sizes={service.documentationCollapsed ? [0, 100] : [30, 70]}
        minSize={service.documentationCollapsed ? [0, 100] : 300}
        collapsed={service.documentationCollapsed ? 0 : undefined}
        hiddenGutter={service.documentationCollapsed}
      >
        <div className="h-full">
          <Documentation />
        </div>
        <div className="flex flex-col h-full">
          <div className="flex min-w-0 items-center gap-2 p-2">
            <ToggleDocumentationCollapsedButton
              style={{
                display: service.documentationCollapsed ? 'flex' : 'none',
              }}
            />
            <div className="flex-1 min-w-0">
              <RequestHistoryTabs />
            </div>
          </div>
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
