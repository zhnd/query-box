import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { AlertCircle, BookOpen, Loader2 } from 'lucide-react'
import { Breadcrumb } from './components/breadcrumb'
import { EmptyState } from './components/empty-state'
import { ToggleDocumentationCollapsedButton } from './components/toggle-documentation-collapsed'
import { TypeContent } from './components/type-content'
import { useService } from './use-service'

export function Documentation() {
  const {
    path,
    currentTypeName,
    currentTypeFields,
    navigateToType,
    navigateToBreadcrumb,
    schemaLoading,
    schemaError,
  } = useService()

  const mainContent = () => {
    if (schemaLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Fetching GraphQL schema from server...
            </p>
          </div>
        </div>
      )
    }
    if (schemaError) {
      return (
        <div className="mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-medium mb-2">Failed to load GraphQL schema</p>
              <p className="text-sm mb-3">
                Documentation features are unavailable. This may affect code
                completion and validation.
              </p>
              <details className="text-xs">
                <summary className="cursor-pointer hover:text-foreground">
                  View error details
                </summary>
                <pre className="mt-2 p-2 bg-muted/50 rounded text-xs overflow-auto whitespace-pre-wrap break-words">
                  {schemaError}
                </pre>
              </details>
            </AlertDescription>
          </Alert>
        </div>
      )
    }

    if (currentTypeFields) {
      return (
        <div className="space-y-6">
          <TypeContent fields={currentTypeFields} onNavigate={navigateToType} />
        </div>
      )
    }

    return (
      <div className="max-w-2xl mx-auto">
        <EmptyState typeName={currentTypeName} />
      </div>
    )
  }

  return (
    <div className="flex-1 h-full flex flex-col min-h-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 pb-3 border-b">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-6 h-6 rounded">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
          </div>
          <h2 className="font-semibold text-base text-foreground">
            Documentation
          </h2>
        </div>
        <ToggleDocumentationCollapsedButton />
      </div>

      {path.length > 0 && !schemaLoading && !schemaError && (
        <>
          <Separator />
          <div className="px-4 py-2 bg-muted/30 border-b">
            <Breadcrumb path={path} onNavigate={navigateToBreadcrumb} />
          </div>
        </>
      )}

      <div className="flex-1 min-h-0 h-0 overflow-hidden bg-muted/30">
        <div className="h-full overflow-y-auto">
          <div className="container mx-auto p-6">{mainContent()}</div>
        </div>
      </div>
    </div>
  )
}
