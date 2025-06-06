import { QueryEditorProps, useService } from './use-service'
export function QueryEditor(props: QueryEditorProps) {
  const { className } = props
  const service = useService(props)
  return <div ref={service.editorContainerElementRef} className={className} />
}
