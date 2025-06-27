import { RequestHistory } from '@/generated/typeshare-types'
import { useGraphQLExplorerPageStore } from '@/stores'
import { useCallback, useRef } from 'react'

export interface RequestHistoryTabItemProps {
  index: number
  requestHistory: RequestHistory
}

export const useRequestHistoryTabItemService = (
  data: RequestHistoryTabItemProps
) => {
  const { requestHistory } = data
  const tabContainerRef = useRef<HTMLDivElement>(null)

  const activeRequestHistory = useGraphQLExplorerPageStore(
    (state) => state.activeRequestHistory
  )
  const isActive = activeRequestHistory?.id === requestHistory.id

  const setActiveRequestHistory = useGraphQLExplorerPageStore(
    (state) => state.setActiveRequestHistory
  )

  const tabItemScrollIntoView = useCallback(() => {
    tabContainerRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [])

  const handleActiveTabChange = () => {
    setActiveRequestHistory({ requestHistory })

    /**
     * Scroll the active tab into view
     * when click to edit the tab name, the tab item width changes,
     * so we need to scroll it into view again.
     * This is a workaround for the issue that the tab item does not scroll into view
     */
    tabItemScrollIntoView()
  }

  return {
    isActive,
    tabContainerRef,
    handleActiveTabChange,
    tabItemScrollIntoView,
  }
}
