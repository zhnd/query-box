import { useGraphQLExplorerPageStore } from '@/stores'
import { usePageGraphQLSchemaStore } from '@/stores/page-graphql-schema-state'
import { nanoid } from 'nanoid'
import { useMemo } from 'react'
import { getFieldCompleteDetails } from '../../utils'

export const useTypeContentService = () => {
  const schema = usePageGraphQLSchemaStore((state) => state.schema)
  const navigationStack = useGraphQLExplorerPageStore(
    (state) => state.navigationStack
  )
  const currentFieldCompleteDetails = useMemo(
    () =>
      getFieldCompleteDetails({
        schema,
        navigationStack,
      }),
    [schema, navigationStack]
  )

  const renderCardList = useMemo(() => {
    const cardList = [
      {
        id: nanoid(),
        title: 'Arguments',
        description: 'Input parameters for this field.',
        fields: currentFieldCompleteDetails?.argumentLists,
      },
      {
        id: nanoid(),
        title: 'Input Fields',
        description: 'Available fields in the input type.',
        fields: currentFieldCompleteDetails?.inputFields,
      },
      {
        id: nanoid(),
        title: 'Fields',
        description: 'Available fields in the current type.',
        fields: currentFieldCompleteDetails?.outputFields,
      },
    ]
    return cardList.filter((card) => card.fields && card.fields.length > 0)
  }, [currentFieldCompleteDetails])

  return {
    renderCardList,
    currentFieldCompleteDetails,
  }
}
