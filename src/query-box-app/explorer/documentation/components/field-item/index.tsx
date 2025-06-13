import { Badge } from '@/components/ui/badge'
import { ChevronRight } from 'lucide-react'
import { DocumentationField } from '../../utils'

export function FieldItem(props: {
  field: DocumentationField
  onNavigate: (typeName: string) => void
}) {
  const { field, onNavigate } = props
  return (
    <div
      className="group relative flex items-center justify-between py-2.5 px-3 rounded border border-border bg-card transition-all duration-150 hover:bg-accent hover:border-accent-foreground/20 cursor-pointer active:scale-[0.98]"
      onClick={() => onNavigate(field.type?.namedType.name ?? '')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onNavigate(field.type?.namedType.name ?? '')
        }
      }}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
        <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary/80" />
        <div className="flex items-center justify-between min-w-0 flex-1 gap-3">
          <span
            className="font-medium text-sm text-foreground truncate max-w-[50%]"
            title={field.name}
          >
            {field.name}
          </span>
          <Badge
            variant="secondary"
            className="text-xs font-mono bg-muted/60 hover:bg-muted/80 transition-colors border-0 px-1.5 py-0.5 flex-shrink-0 max-w-[50%]"
            title={field.type?.displayName ?? ''}
          >
            <span className="truncate">{field.type?.displayName ?? ''}</span>
          </Badge>
        </div>
      </div>
      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-all duration-150 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 flex-shrink-0" />
    </div>
  )
}
