import { useEndpointPageStore } from '@/stores'
import _ from 'lodash'
import { ChangeEvent, useMemo } from 'react'

export const useEndpointSearchService = () => {
  const setCreateDialogOpen = useEndpointPageStore(
    (state) => state.setCreateDialogOpen
  )

  const setSearchQuery = useEndpointPageStore((state) => state.setSearchQuery)

  const openCreateDialog = () => {
    setCreateDialogOpen(true)
  }

  const debouncedSetSearchQuery = useMemo(
    () =>
      _.debounce((value: string) => {
        setSearchQuery({ filterString: value })
      }, 500),
    [setSearchQuery]
  )

  const handleSearchQueryStringOnChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target
    debouncedSetSearchQuery(value)
  }

  return {
    openCreateDialog,
    handleSearchQueryStringOnChange,
  }
}
