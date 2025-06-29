import { DocumentationField } from '../../types'
import { FieldItem } from '../field-item'

interface FieldListProps {
  fields: DocumentationField[]
  operation?: DocumentationField
}

export function FieldList(props: FieldListProps) {
  const { fields, operation } = props
  if (!fields?.length) return null

  return (
    <div className="space-y-1.5">
      {fields.map((field) => (
        <FieldItem key={field.name} field={field} operation={operation} />
      ))}
    </div>
  )
}
