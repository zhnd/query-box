import { DocumentationField } from '../../utils'
import { FieldItem } from '../field-item'

export function FieldList(props: {
  fields: DocumentationField[] | undefined
  onNavigate: (typeName: string) => void
}) {
  const { fields, onNavigate } = props
  if (!fields?.length) return null

  return (
    <div className="space-y-1.5">
      {fields.map((field) => (
        <FieldItem key={field.name} field={field} onNavigate={onNavigate} />
      ))}
    </div>
  )
}
