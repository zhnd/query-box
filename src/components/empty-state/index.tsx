import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Card className="max-w-md border border-muted shadow-sm rounded-lg">
        <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </div>
  )
}
