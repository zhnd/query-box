import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Hash, Zap } from 'lucide-react'
import { CurrentTypeField } from '../../utils'
import { FieldList } from '../field-list'
import { OperationSection } from '../operation-section'
import { ParsedDescription } from '../parsed-description'

export function TypeContent(props: {
  fields: CurrentTypeField
  onNavigate: (typeName: string) => void
}) {
  const { fields, onNavigate } = props

  return (
    <div className="space-y-4">
      {/* Type Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/10">
            <Hash className="h-4 w-4 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">{fields.name}</h1>
        </div>
        {fields.description && (
          <p className="text-sm text-muted-foreground leading-relaxed pl-10">
            <ParsedDescription text={fields.description} />
          </p>
        )}
      </div>

      {/* Operations Section */}
      {fields.operations?.some((op) => op.subFields?.length) && (
        <Card className="shadow-sm gap-2">
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
                <OperationSection
                  key={operation.name}
                  operation={operation}
                  onNavigate={onNavigate}
                />
              ) : null
            )}
          </CardContent>
        </Card>
      )}

      {/* Fields Section */}
      {fields.subFields?.length ? (
        <Card className="shadow-sm gap-2">
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
