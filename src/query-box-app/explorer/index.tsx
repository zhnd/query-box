import { ResponseViewer } from '@/components/response-viewer'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { RequestHistoryTabs } from './history-tabs'
import { Request } from './request'
import { useExplorerService } from './use-explorer-sevice'

export function Explorer() {
  const service = useExplorerService()
  console.log('Explorer', service.response)
  return (
    <div className="explorer flex-1 flex flex-col">
      <RequestHistoryTabs />
      <div className="flex-1 flex min-h-0">
        <ResizablePanelGroup direction={'horizontal'}>
          <ResizablePanel defaultSize={50} minSize={30}>
            <Request />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50} minSize={30}>
            <ResponseViewer data={service.response} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
