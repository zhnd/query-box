import { useGraphQLExplorerPageStore } from '@/stores'
import { usePageGraphQLSchemaStore } from '@/stores/page-graphql-schema-state'
import {
  FieldDetailBasicInfo,
  FieldMetaInfo,
  OutputFieldInfo,
} from '../../types'
import { navigateToChild } from '../../utils'

export interface FieldListProps {
  subFields: OutputFieldInfo[] | FieldMetaInfo[]
  fieldDetails: FieldDetailBasicInfo | undefined
}

export const useFieldListService = (data: FieldListProps) => {
  const { subFields } = data

  const setNavigationStack = useGraphQLExplorerPageStore(
    (state) => state.setNavigationStack
  )
  const navigateToFieldDefinition = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.stopPropagation()
    const schema = usePageGraphQLSchemaStore.getState().schema
    const navigationStack =
      useGraphQLExplorerPageStore.getState().navigationStack

    if (!schema) return
    const fieldElement = (event.target as HTMLElement).closest(
      '[data-field-index]'
    )

    const index: number = fieldElement
      ? Number(fieldElement.getAttribute('data-field-index'))
      : 0
    const newStack = navigateToChild({
      navigationStack,
      fieldMetaInfo: subFields[index],
    })

    setNavigationStack(newStack)
  }

  return {
    navigateToFieldDefinition,
  }
}
