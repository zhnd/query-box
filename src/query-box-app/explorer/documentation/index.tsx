import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronRight, Code2, FileText, Zap } from 'lucide-react'
import { useService } from './use-service'
import {
  BreadcrumbPathType,
  CurrentTypeField,
  DocumentationField,
} from './utils'

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

// Breadcrumb Component
const Breadcrumb = ({
  path,
  onNavigate,
}: {
  path: BreadcrumbPathType[]
  onNavigate: (index: number) => void
}) => (
  <nav className="flex items-center gap-1 flex-wrap" aria-label="Breadcrumb">
    {path.map((breadcrumb, idx) => (
      <div key={breadcrumb.id} className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors rounded"
          onClick={() => onNavigate(idx)}
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

// Field Item Component
const FieldItem = ({
  field,
  onNavigate,
}: {
  field: DocumentationField
  onNavigate: (typeName: string) => void
}) => {
  return (
    <div
      className="group relative flex items-center justify-between py-2.5 px-3 rounded border border-border bg-card transition-all duration-150 hover:bg-accent hover:border-accent-foreground/20 cursor-pointer active:scale-[0.98]"
      onClick={() => onNavigate(field.type?.name ?? '')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onNavigate(field.type?.name ?? '')
        }
      }}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary/80" />
        <span className="font-medium text-sm text-foreground truncate">
          {field.name}
        </span>
        <Badge
          variant="secondary"
          className="text-xs font-mono bg-muted/60 hover:bg-muted/80 transition-colors border-0 px-1.5 py-0.5 ml-auto"
        >
          {field.type?.name ?? ''}
        </Badge>
      </div>
      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-all duration-150 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 flex-shrink-0 ml-2" />
    </div>
  )
}

// Field List Component
const FieldList = ({
  fields,
  onNavigate,
}: {
  fields: DocumentationField[] | undefined
  onNavigate: (typeName: string) => void
}) => {
  if (!fields?.length) return null

  return (
    <div className="space-y-1.5">
      {fields.map((field) => (
        <FieldItem key={field.name} field={field} onNavigate={onNavigate} />
      ))}
    </div>
  )
}

// Type Content Component
const TypeContent = (props: {
  fields: CurrentTypeField
  onNavigate: (typeName: string) => void
}) => {
  const { fields, onNavigate } = props

  return (
    <div className="space-y-4">
      {/* Type Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/10">
            <Code2 className="h-4 w-4 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">{fields.name}</h1>
        </div>
        {fields.description && (
          <p className="text-sm text-muted-foreground leading-relaxed pl-10">
            {fields.description}
          </p>
        )}
      </div>

      {/* Operations Section */}
      {fields.operations?.some((op) => op.subFields?.length) && (
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded bg-primary/10">
                <Zap className="h-3.5 w-3.5 text-primary" />
              </div>
              Operations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.operations?.map((operation) =>
              operation.subFields?.length ? (
                <div key={operation.name} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="font-medium px-2 py-0.5 text-xs bg-background border-border"
                    >
                      {operation.name}
                    </Badge>
                  </div>
                  <div className="pl-3 border-l-2 border-muted">
                    <FieldList
                      fields={operation.subFields}
                      onNavigate={onNavigate}
                    />
                  </div>
                </div>
              ) : null
            )}
          </CardContent>
        </Card>
      )}

      {/* Fields Section */}
      {fields.subFields?.length ? (
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded bg-primary/10">
                <FileText className="h-3.5 w-3.5 text-primary" />
              </div>
              Fields
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FieldList fields={fields.subFields} onNavigate={onNavigate} />
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

// Empty State Component
const EmptyState = ({ typeName }: { typeName: string }) => (
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
