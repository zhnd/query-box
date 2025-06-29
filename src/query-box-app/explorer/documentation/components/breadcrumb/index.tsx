import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import { useBreadcrumbService } from './use-service'

export function Breadcrumb() {
  const service = useBreadcrumbService()
  return (
    <nav
      onClick={service.handleBreadcrumbClick}
      className="flex items-center gap-1 flex-wrap"
      aria-label="Breadcrumb"
    >
      {service.navigationStack.map((breadcrumb, index) => (
        <div
          key={breadcrumb.name}
          data-field-index={index}
          className="flex items-center gap-1"
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors rounded"
          >
            {breadcrumb.name}
          </Button>
          {index < service.navigationStack.length - 1 && (
            <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          )}
        </div>
      ))}
    </nav>
  )
}
