import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { DocumentationField } from '../../utils'
import { FieldList } from '../field-list'

export function OperationSection(props: {
  operation: DocumentationField
  onNavigate: (typeName: string) => void
}) {
  const { operation, onNavigate } = props
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between w-full group cursor-pointer rounded p-1 hover:bg-accent/50 transition-colors">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="font-medium px-2 py-0.5 text-xs bg-background border-border"
              title={operation.name}
            >
              <span className="truncate max-w-[200px]">{operation.name}</span>
            </Badge>
          </div>
          <div className="flex items-center justify-center w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity">
            {isOpen ? (
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div key={operation.name} className="space-y-2 mt-1">
          <div className="pl-3 border-l-2 border-muted">
            <FieldList fields={operation.subFields} onNavigate={onNavigate} />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
