import { RequestHistoryBridge } from '@/bridges'
import { HttpMethod } from '@/generated/typeshare-types'
import {
  useEndpointSelectedStateStore,
  useGraphQLExplorerPageStore,
} from '@/stores'
import { useEffect, useRef } from 'react'

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

  const createEmptyRequestHistory = async () => {
    return await RequestHistoryBridge.createRequestHistory({
      endpoint_id: selectedEndpoint?.id ?? '',
      method: HttpMethod.POST,
    })
  }

  const handleAddRequestHistory = async () => {
    const newRequestHistory = await createEmptyRequestHistory()
    setRequestHistories([...requestHistories, newRequestHistory])
    setActiveRequestHistory(newRequestHistory)
  }

  const getInitialRequestHistories = async () => {
    let initialRequestHistories =
      await RequestHistoryBridge.listRequestHistories({
        endpoint_id: selectedEndpoint?.id ?? '',
      })
    if (initialRequestHistories.length === 0) {
      const newRequestHistory = await createEmptyRequestHistory()
      initialRequestHistories = [newRequestHistory]
    }
    setRequestHistories(initialRequestHistories)
    setActiveRequestHistory(initialRequestHistories[0])
  }

  useEffect(() => {
    if (!selectedEndpoint) {
      return
    }
    getInitialRequestHistories()
  }, [selectedEndpoint])

  const handleDeleteRequestHistory = async (id: string) => {
    await RequestHistoryBridge.deleteRequestHistory({
      id,
      endpoint_id: selectedEndpoint?.id ?? '',
    })

    const targetRequestHistoryIndex = requestHistories.findIndex(
      (requestHistory) => requestHistory.id === id
    )

    let newRequestHistories = requestHistories.filter(
      (requestHistory) => requestHistory.id !== id
    )

    if (newRequestHistories.length === 0) {
      const newRequestHistory = await createEmptyRequestHistory()
      newRequestHistories = [newRequestHistory]
      setActiveRequestHistory(newRequestHistory)
      setRequestHistories(newRequestHistories)
      return
    }
    setRequestHistories(newRequestHistories)
    if (activeRequestHistory?.id === id) {
      const nextActiveRequestHistory =
        newRequestHistories[Math.max(targetRequestHistoryIndex - 1, 0)]
      setActiveRequestHistory(nextActiveRequestHistory)
    }
  }

  const handleDeleteAllRequestHistories = async () => {
    await RequestHistoryBridge.deleteRequestHistory({
      endpoint_id: selectedEndpoint?.id ?? '',
    })
    const newRequestHistory = await createEmptyRequestHistory()
    setRequestHistories([newRequestHistory])
    setActiveRequestHistory(newRequestHistory)
  }

  useEffect(() => {
    if (tabsContainerRef.current && activeRequestHistory) {
      const activeTabElement = tabsContainerRef.current.querySelector(
        `[data-tab-id="${activeRequestHistory.id}"]`
      )
      if (activeTabElement) {
        activeTabElement.scrollIntoView({
          behavior: 'smooth',
        })
      }
    }
  }, [activeRequestHistory])

  const handleActiveTabChange = (id: string) => {
    setActiveRequestHistory(requestHistories.find((r) => r.id === id) ?? null)
  }

  return {
    requestHistories,
    activeRequestHistory,
    tabsContainerRef,
    handleActiveTabChange,
    handleAddRequestHistory,
    handleDeleteRequestHistory,
    handleDeleteAllRequestHistories,
  }
}
