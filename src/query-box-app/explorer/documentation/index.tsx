import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ChevronRight, FileText, Hash, Info } from 'lucide-react'
import { useService } from './use-service'
import {
  BreadcrumbPathType,
  CurrentTypeFields,
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
      <div className="flex items-center gap-2 px-4 py-3 border-b">
        <FileText className="h-4 w-4" />
        <h2 className="font-semibold">Documentation</h2>
      </div>

      {/* Breadcrumb Navigation */}
      {path.length > 0 && (
        <div className="px-4 pt-4 pb-2">
          <Breadcrumb path={path} onNavigate={navigateToBreadcrumb} />
          <Separator className="mt-4" />
        </div>
      )}

      {/* Type Fields Container */}
      <div className="flex-1 min-h-0 h-0 pr-4">
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
  <div className="flex items-center gap-1 flex-wrap">
    {path.map((breadcrumb, idx) => (
      <div key={breadcrumb.id} className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs hover:bg-accent"
          onClick={() => onNavigate(idx)}
        >
          {breadcrumb.name}
        </Button>
        {idx < path.length - 1 && (
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
        )}
      </div>
    ))}
  </div>
)

// Field Item Component
const FieldItem = ({
  field,
  onNavigate,
}: {
  field: DocumentationField
  onNavigate: (typeName: string) => void
}) => (
  <div
    className={`
      flex items-center justify-between p-2 rounded-md transition-colors
      ${field.isObjectType ? 'hover:bg-accent cursor-pointer' : ''}
    `}
    onClick={() => field.isObjectType && onNavigate(field.type.name)}
  >
    <div className="flex items-center gap-2 min-w-0">
      <span className="font-medium text-sm truncate">{field.name}</span>
      <Badge variant="outline" className="text-xs font-mono">
        {field.type.name}
      </Badge>
    </div>
  </div>
)

// Field List Component
const FieldList = ({
  fields,
  onNavigate,
}: {
  fields: DocumentationField[]
  onNavigate: (typeName: string) => void
}) => (
  <div className="space-y-1">
    {fields.map((field) => (
      <FieldItem key={field.name} field={field} onNavigate={onNavigate} />
    ))}
  </div>
)

// Field Section Component
const FieldSection = ({
  title,
  fields,
  onNavigate,
}: {
  title: string
  fields: DocumentationField[]
  onNavigate: (typeName: string) => void
}) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <Hash className="h-3 w-3" />
      <h3 className="text-sm font-medium">{title}</h3>
      <Badge variant="secondary" className="text-xs">
        {fields.length}
      </Badge>
    </div>
    <FieldList fields={fields} onNavigate={onNavigate} />
  </div>
)

// Type Content Component
const TypeContent = ({
  fields,
  onNavigate,
}: {
  fields: CurrentTypeFields
  onNavigate: (typeName: string) => void
}) => {
  if (!fields) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Info className="h-4 w-4" />
        No fields available
      </div>
    )
  }

  if (Array.isArray(fields)) {
    return (
      <FieldSection title="Fields" fields={fields} onNavigate={onNavigate} />
    )
  }

  return (
    <div className="space-y-6">
      {fields.query.length > 0 && (
        <FieldSection
          title="Query Fields"
          fields={fields.query}
          onNavigate={onNavigate}
        />
      )}
      {fields.mutation.length > 0 && (
        <>
          {fields.query.length > 0 && <Separator />}
          <FieldSection
            title="Mutation Fields"
            fields={fields.mutation}
            onNavigate={onNavigate}
          />
        </>
      )}
    </div>
  )
}

// Empty State Component
const EmptyState = ({ typeName }: { typeName: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="rounded-full bg-muted p-3 mb-4">
      <FileText className="h-8 w-8 text-muted-foreground" />
    </div>
    <h3 className="font-medium mb-2">Unsupported Type</h3>
    <p className="text-sm text-muted-foreground mb-3">
      This type is not supported for documentation
    </p>
    <Badge variant="outline" className="font-mono">
      {typeName}
    </Badge>
  </div>
)
