import { QueryEditorProps, useService } from './use-service'
export function QueryEditor(props: QueryEditorProps) {
  const service = useService(props)
  return (
    <div
      className="w-full h-full"
      ref={service.editorContainerElementRef}
    ></div>
  )
}
