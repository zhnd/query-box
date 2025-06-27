import { memo } from 'react'
import { QueryEditorProps } from './types'
import { useService } from './use-service'

export const QueryEditor = memo(function QueryEditor(props: QueryEditorProps) {
  const { className } = props
  const service = useService(props)
  return <div ref={service.editorContainerElementRef} className={className} />
})
