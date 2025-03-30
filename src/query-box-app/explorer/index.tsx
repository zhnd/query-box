import { Request } from './request'
import { TabBar } from './tab-bar'

export function Explorer() {
  return (
    <div className="explorer flex-1 flex flex-col">
      <TabBar />

      <div className="flex-1 flex min-h-0">
        <Request />
      </div>
    </div>
  )
}
