import { Button } from '@/components/ui/button'
import { ArrowLeftFromLine, BookOpen } from 'lucide-react'
import {
  ToggleDocumentationCollapsedButtonProps,
  useToggleDocumentationCollapsedService,
} from './use-service'

export function ToggleDocumentationCollapsedButton(
  props: ToggleDocumentationCollapsedButtonProps
) {
  const { style } = props
  const service = useToggleDocumentationCollapsedService()

  return (
    <Button
      onClick={service.toggleDocumentationCollapsed}
      title={service.isCollapsed ? 'Show Documentation' : 'Hide Documentation'}
      variant="ghost"
      size="icon"
      className="h-6 w-6"
      style={style}
    >
      {service.isCollapsed ? (
        <BookOpen size={16} />
      ) : (
        <ArrowLeftFromLine size={16} />
      )}
    </Button>
  )
}
