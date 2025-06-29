import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import { BreadcrumbPathType } from '../../types'
import { useBreadcrumbService } from './use-service'

export function Breadcrumb(props: { path: BreadcrumbPathType[] }) {
  const { path } = props
  const service = useBreadcrumbService()
  return (
    <nav className="flex items-center gap-1 flex-wrap" aria-label="Breadcrumb">
      {path.map((breadcrumb, idx) => (
        <div key={breadcrumb.id} className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors rounded"
            onClick={() => service.navigateToBreadcrumb(idx)}
          >
            {breadcrumb.name}
          </Button>
          {idx < path.length - 1 && (
            <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          )}
        </div>
      ))}
    </nav>
  )
}
