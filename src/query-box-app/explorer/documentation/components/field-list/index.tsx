import { FieldItem } from '../field-item'
import { FieldListProps, useFieldListService } from './use-service'

export function FieldList(props: FieldListProps) {
  const { subFields } = props
  const service = useFieldListService(props)
  if (!subFields?.length) return null

  return (
    <div
      className="flex flex-col space-y-1.5"
      onClick={service.navigateToFieldDefinition}
    >
      {subFields.map((field, index) => (
        <FieldItem
          key={field.name}
          field={field}
          fieldDetails={props.fieldDetails}
          index={index}
        />
      ))}
    </div>
  )
}
