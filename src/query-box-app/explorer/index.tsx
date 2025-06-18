import LoadErrorArea from '@/components/load-error-area'
import LoadingSpinnerArea from '@/components/loading-spinner-area'
import { ResponseViewer } from '@/components/response-viewer'
import { SplitResizable } from '@/components/split-resizable'
import { Documentation } from './documentation'
import { RequestHistoryTabs } from './history-tabs'
import { Request } from './request'
import { useExplorerService } from './use-explorer-service'

export function Explorer() {
  const service = useExplorerService()

  return (
    <div className="explorer relative flex-1 flex flex-col">
      <LoadingSpinnerArea
        loading={service.pageLoadState.loading}
        message="schema fetching and parsing..."
      />
      <LoadErrorArea
        error={service.pageLoadState.error}
        message="Error fetching or parsing schema, please check your endpoint URL and headers."
      />
      <SplitResizable className="flex-1 flex min-h-0" sizes={[30, 70]}>
        <div className=" p-4 h-full">
          <Documentation />
        </div>
        <div className="flex flex-col pt-4 h-full">
          <RequestHistoryTabs />

          <SplitResizable className="flex-1 flex min-h-0" sizes={[50, 50]}>
            <div className="pt-4 h-full">
              <Request />
            </div>
            <div className="pt-4 h-full">
              <ResponseViewer data={service.response} />
            </div>
          </SplitResizable>
        </div>
      </SplitResizable>
    </div>
  )
}
