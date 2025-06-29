import { useGraphQLExplorerPageStore } from '@/stores'
import { usePageGraphQLSchemaStore } from '@/stores/page-graphql-schema-state'
import { DocumentationField } from '../../types'
import { getCurrentTypeFields } from '../../utils'

export interface FieldItemProps {
  field: DocumentationField
  operation?: DocumentationField
}

export const useFieldItemService = (data: FieldItemProps) => {
  const { field, operation } = data

  const setViewGraphQLDefinitionField = useGraphQLExplorerPageStore(
    (state) => state.setViewGraphQLDefinitionField
  )

  const setDocumentationPaths = useGraphQLExplorerPageStore(
    (state) => state.setDocumentationPaths
  )

  const documentationPaths = useGraphQLExplorerPageStore(
    (state) => state.documentationPaths
  )

  const schema = usePageGraphQLSchemaStore((state) => state.schema)

  const navigateToFieldDefinition = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.stopPropagation()
    // console.log('navigateToFieldDefinition', field, operation)
    getCurrentTypeFields({
      schema,
      operation: {
        operationType: operation?.operationType,
      },
      field: {
        name: field.name,
      },
    })
    // setDocumentationPaths([
    //   ...documentationPaths,
    //   {
    //     name: field.name,
    //     id: nanoid(),
    //   },
    // ])
    // setViewGraphQLDefinitionField({
    //   name: field.name,
    // })
  }

  return {
    setViewGraphQLDefinitionField,
    setDocumentationPaths,
    documentationPaths,
    navigateToFieldDefinition,
  }
}
