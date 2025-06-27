import { RequestHistoryBridge } from '@/bridges'
import { RequestHistory } from '@/generated/typeshare-types'
import {
  useEndpointSelectedStateStore,
  useGraphQLExplorerPageStore,
} from '@/stores'
import { useEffect, useRef } from 'react'
import { createEmptyRequestHistory } from './utils'

export const useRequestHistoryTabsService = () => {
  const requestHistories = useGraphQLExplorerPageStore(
    (state) => state.requestHistories
  )
  const setRequestHistories = useGraphQLExplorerPageStore(
    (state) => state.setRequestHistories
  )
  const activeRequestHistory = useGraphQLExplorerPageStore(
    (state) => state.activeRequestHistory
  )
  const setActiveRequestHistory = useGraphQLExplorerPageStore(
    (state) => state.setActiveRequestHistory
  )

  const tabsContainerRef = useRef<HTMLDivElement>(null)

  const selectedEndpoint = useEndpointSelectedStateStore(
    (state) => state.currentPageSelectedEndpoint
  )

  const handleAddRequestHistory = async () => {
    const newRequestHistory = await createEmptyRequestHistory({
      endpoint: selectedEndpoint,
    })
    setRequestHistories([...requestHistories, newRequestHistory])
    setActiveRequestHistory({ requestHistory: newRequestHistory })
    autoTabScrollIntoView(newRequestHistory)
  }

  const getInitialRequestHistories = async () => {
    let initialRequestHistories =
      await RequestHistoryBridge.listRequestHistories({
        endpoint_id: selectedEndpoint?.id ?? '',
      })
    if (initialRequestHistories.length === 0) {
      const newRequestHistory = await createEmptyRequestHistory({
        endpoint: selectedEndpoint,
      })
      initialRequestHistories = [newRequestHistory]
      setActiveRequestHistory({ requestHistory: newRequestHistory })
    }
    setRequestHistories(initialRequestHistories)
    const activeRequestHistoryInDatabase = initialRequestHistories.find(
      (history) => history.active
    )
    setActiveRequestHistory({
      requestHistory:
        activeRequestHistoryInDatabase ?? initialRequestHistories[0],
      updateActiveBackend: !activeRequestHistoryInDatabase,
    })
  }

  useEffect(() => {
    if (!selectedEndpoint) {
      return
    }
    getInitialRequestHistories()
  }, [selectedEndpoint])

  const handleDeleteAllRequestHistories = async () => {
    await RequestHistoryBridge.deleteRequestHistory({
      endpoint_id: selectedEndpoint?.id ?? '',
    })
    const newRequestHistory = await createEmptyRequestHistory({
      endpoint: selectedEndpoint,
    })
    setRequestHistories([newRequestHistory])
    setActiveRequestHistory({ requestHistory: newRequestHistory })
    autoTabScrollIntoView(newRequestHistory)
  }

  /**
   * when click select the active tab from the request history list of the collapsed dropdown list
   * Automatically scroll the active tab into view.
   * This is useful when the list is long and the active tab is not visible.
   * @param requestHistory
   */
  const autoTabScrollIntoView = (requestHistory: RequestHistory) => {
    if (tabsContainerRef.current && requestHistory) {
      const activeTabElement = tabsContainerRef.current.querySelector(
        `[data-tab-id="${requestHistory.id}"]`
      )
      if (activeTabElement) {
        activeTabElement.scrollIntoView({
          behavior: 'smooth',
        })
      }
    }
  }

  useEffect(() => {
    if (!activeRequestHistory) {
      return
    }
    const timer = setTimeout(() => {
      autoTabScrollIntoView(activeRequestHistory)
    })
    return () => clearTimeout(timer)
  }, [activeRequestHistory])

  const handleActiveTabChange = (record: RequestHistory) => {
    setActiveRequestHistory({ requestHistory: record })
    autoTabScrollIntoView(record)
  }

  return {
    requestHistories,
    activeRequestHistory,
    tabsContainerRef,
    handleActiveTabChange,
    handleAddRequestHistory,
    handleDeleteAllRequestHistories,
  }
}
