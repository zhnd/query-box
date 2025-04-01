import { ResponseViewer } from '@/components/response-viewer'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Request } from './request'
import { TabBar } from './tab-bar'

export function Explorer() {
  return (
    <div className="explorer flex-1 flex flex-col">
      <TabBar />
      <div className="flex-1 flex min-h-0">
        <ResizablePanelGroup direction={'horizontal'}>
          <ResizablePanel defaultSize={50} minSize={30}>
            <Request />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50} minSize={30}>
            <ResponseViewer />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
