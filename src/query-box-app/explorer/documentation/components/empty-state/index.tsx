import { Badge } from '@/components/ui/badge'
import { FileText } from 'lucide-react'

export function EmptyState(props: { typeName: string }) {
  const { typeName } = props
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted/50 p-4 mb-4">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-2 max-w-sm">
        <h3 className="font-semibold text-lg text-foreground">
          Unsupported Type
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This type is not currently supported for documentation viewing.
        </p>
        <Badge
          variant="secondary"
          className="font-mono px-3 py-1 bg-muted/60 border-0 text-xs"
        >
          {typeName}
        </Badge>
      </div>
    </div>
  )
}
