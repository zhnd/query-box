import { JsonViewerProps, useJsonViewerService } from './use-service'

export function JsonViewer(props: JsonViewerProps) {
  const service = useJsonViewerService(props)
  return <div className="w-full h-full" ref={service.viewContainerElementRef} />
}
