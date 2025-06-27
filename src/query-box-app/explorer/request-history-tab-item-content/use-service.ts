import { RequestHistoryBridge } from '@/bridges'
import { RequestHistory } from '@/generated/typeshare-types'
import {
  useEndpointSelectedStateStore,
  useGraphQLExplorerPageStore,
} from '@/stores'
import { useMutation } from '@tanstack/react-query'
import { List } from 'immutable'
import { useState } from 'react'
import { createEmptyRequestHistory } from '../request-history-tab-list/utils'

export interface RequestHistoryTabItemContentProps {
  index: number
  requestHistory: RequestHistory
  tabItemScrollIntoView: () => void
}

export enum RequestHistoryTabItemViewType {
  EDIT = 'edit',
  INFO = 'info',
}

export const useRequestHistoryTabItemContentService = (
  data: RequestHistoryTabItemContentProps
) => {
  const { requestHistory, tabItemScrollIntoView, index } = data
  const [viewType, setViewType] = useState<RequestHistoryTabItemViewType>(
    RequestHistoryTabItemViewType.INFO
  )
  const [tabName, setTabName] = useState<string>(requestHistory.name ?? '')

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

  const selectedEndpoint = useEndpointSelectedStateStore(
    (state) => state.currentPageSelectedEndpoint
  )

  const refreshRequestHistories = async () => {
    const updatedRequestHistories =
      await RequestHistoryBridge.listRequestHistories({
        endpoint_id: selectedEndpoint?.id ?? '',
      })
    setRequestHistories(updatedRequestHistories)
    setActiveRequestHistory({
      requestHistory: updatedRequestHistories[index],
      updateActiveBackend: false,
    })
  }

  const { mutate: updateRequestHistory, isPending: updatingRequestHistory } =
    useMutation({
      mutationFn: RequestHistoryBridge.updateRequestHistory,
      onSuccess: () => {
        setViewType(RequestHistoryTabItemViewType.INFO)
        refreshRequestHistories()
      },
    })

  const handleDeleteRequestHistory = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation()
    await RequestHistoryBridge.deleteRequestHistory({
      id: requestHistory.id,
      endpoint_id: selectedEndpoint?.id ?? '',
    })

    const currentRequestHistories = List(requestHistories)

    let nextRequestHistories = currentRequestHistories.remove(index)

    // If the request history is the last one, create a new empty one
    if (!nextRequestHistories.size) {
      const newRequestHistory = await createEmptyRequestHistory({
        endpoint: selectedEndpoint,
      })
      nextRequestHistories = nextRequestHistories.push(newRequestHistory)
    }
    setRequestHistories(nextRequestHistories.toArray())

    /**
     * If the deleted request history is the active one, set the next one as active
     * If the deleted request history is not the active one, do nothing
     */
    const deleteCurrent = activeRequestHistory?.id === requestHistory.id
    if (!deleteCurrent) return
    const newActiveIndex = Math.min(index, nextRequestHistories.size - 1)
    setActiveRequestHistory({
      requestHistory: nextRequestHistories.get(newActiveIndex) ?? null,
    })
  }

  const handleEditTabName = () => {
    if (
      updatingRequestHistory ||
      activeRequestHistory?.id !== requestHistory.id
    ) {
      return
    }

    setViewType(RequestHistoryTabItemViewType.EDIT)
    setTabName(requestHistory.name ?? '')
    setActiveRequestHistory({ requestHistory })
    setTimeout(() => {
      tabItemScrollIntoView()
    }, 50)
  }

  const handleTabNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTabName(event.target.value)
  }

  const handleSaveTabName = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation()
    updateRequestHistory({
      id: requestHistory.id,
      name: tabName,
      is_custom_name: true,
    })
  }

  const handleCancelEditTabName = async () => {
    if (updatingRequestHistory) return
    setViewType(RequestHistoryTabItemViewType.INFO)
    setTabName(requestHistory.name ?? '')
  }

  const handleTagNameInputKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    event.stopPropagation()
    if (event.key === 'Enter') {
      updateRequestHistory({
        id: requestHistory.id,
        name: tabName,
        is_custom_name: true,
      })
    } else if (event.key === 'Escape') {
      await handleCancelEditTabName()
    }
  }

  return {
    viewType,
    tabName,
    updatingRequestHistory,
    handleEditTabName,
    handleDeleteRequestHistory,
    handleTabNameChange,
    handleSaveTabName,
    handleCancelEditTabName,
    handleTagNameInputKeyDown,
  }
}
