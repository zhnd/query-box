import { ResponseViewer } from '@/components/response-viewer'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Documentation } from './documentation'
import { RequestHistoryTabs } from './history-tabs'
import { Request } from './request'
import { useExplorerService } from './use-explorer-sevice'

export function Explorer() {
  const service = useExplorerService()
  return (
    <div className="explorer flex-1 flex flex-col">
      <div className="flex-1 flex min-h-0">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={30} minSize={30}>
            <Documentation />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel
            defaultSize={70}
            minSize={40}
            className="flex flex-col"
          >
            <RequestHistoryTabs />
            <div className="flex-1 min-h-0">
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={50} minSize={20}>
                  <Request />
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={50} minSize={20}>
                  <ResponseViewer data={service.response} />
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
