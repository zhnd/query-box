import { useJsonViewerService } from './use-service'

export function JsonViewer() {
  const service = useJsonViewerService()
  return <div className="w-full h-full" ref={service.viewContainerElementRef} />
}
