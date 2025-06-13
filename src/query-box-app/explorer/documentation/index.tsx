import { FileText } from 'lucide-react'
import { Breadcrumb } from './components/breadcrumb'
import { EmptyState } from './components/empty-state'
import { TypeContent } from './components/type-content'
import { useService } from './use-service'

export function Documentation() {
  const {
    path,
    currentTypeName,
    currentTypeFields,
    navigateToType,
    navigateToBreadcrumb,
  } = useService()

  return (
    <div className="flex-1 h-full flex flex-col min-h-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-center w-6 h-6 rounded bg-primary/10">
          <FileText className="h-3.5 w-3.5 text-primary" />
        </div>
        <h2 className="font-semibold text-base text-foreground">
          Documentation
        </h2>
      </div>

      {/* Breadcrumb Navigation */}
      {path.length > 0 && (
        <div className="px-4 py-2 bg-muted/30 border-b">
          <Breadcrumb path={path} onNavigate={navigateToBreadcrumb} />
        </div>
      )}

      {/* Type Fields Container */}
      <div className="flex-1 min-h-0 h-0 p-4">
        <div className="h-full overflow-y-auto">
          {currentTypeFields ? (
            <TypeContent
              fields={currentTypeFields}
              onNavigate={navigateToType}
            />
          ) : (
            <EmptyState typeName={currentTypeName} />
          )}
        </div>
      </div>
    </div>
  )
}
