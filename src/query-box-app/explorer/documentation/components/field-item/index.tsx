import { Button } from '@/components/ui/button'
import { cn } from '@/lib'
import { ChevronRight } from 'lucide-react'
import { FieldDetailBasicInfo, FieldMetaInfo } from '../../types'

export interface FieldItemProps {
  field: FieldMetaInfo
  fieldDetails: FieldDetailBasicInfo | undefined
  index: number
}

export function FieldItem(props: FieldItemProps) {
  const { field, fieldDetails, index } = props

  return (
    <Button
      variant="ghost"
      data-field-index={index}
      className="h-auto px-2 py-1.5 justify-start hover:bg-accent/50 transition-colors group w-full"
    >
      <div className="flex items-center w-full min-w-0 gap-2">
        <div className="flex flex-col items-start gap-0.5 flex-1 min-w-0 w-0 overflow-hidden">
          <span
            className={cn(
              'font-medium text-sm text-left text-foreground leading-tight truncate w-full',
              Boolean(field?.deprecationReason) && 'line-through'
            )}
            title={field.name}
          >
            {field.name}
          </span>
          <span
            className="text-xs text-muted-foreground text-left font-mono leading-tight truncate w-full"
            title={field.displayType}
          >
            {field.displayType}
          </span>
        </div>

        {!fieldDetails?.isLeafType && (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
        )}
      </div>
    </Button>
  )
}
