import { useExplorerDocumentationCollapsedStore } from '@/stores'
import { CSSProperties } from 'react'

export interface ToggleDocumentationCollapsedButtonProps {
  style?: CSSProperties
}

export const useToggleDocumentationCollapsedService = () => {
  const isCollapsed = useExplorerDocumentationCollapsedStore(
    (state) => state.isCollapsed
  )

  const setCollapsed = useExplorerDocumentationCollapsedStore(
    (state) => state.setCollapsed
  )

  const toggleDocumentationCollapsed = () => {
    setCollapsed(!isCollapsed)
  }

  return {
    isCollapsed,
    toggleDocumentationCollapsed,
  }
}
