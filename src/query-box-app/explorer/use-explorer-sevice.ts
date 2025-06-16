import { useGraphQLExplorerPageStore } from '@/stores'

export const useExplorerService = () => {
  const { response } = useGraphQLExplorerPageStore()

  return { response }
}
