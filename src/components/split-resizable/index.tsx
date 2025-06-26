import '@/styles/split-resizable.css'
import Split from 'react-split'
import { SplitResizableProps, useSplitResizableService } from './use-service'

export function SplitResizable(props: SplitResizableProps) {
  const service = useSplitResizableService(props)
  return <Split {...service.splitComponentProps}>{props.children}</Split>
}
