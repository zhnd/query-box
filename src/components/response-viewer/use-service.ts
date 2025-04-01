import { useState } from 'react'
import { ResponseViewType } from './constants'

export const useResponseViewerService = () => {
  const [activeView, setActiveView] = useState<ResponseViewType>(
    ResponseViewType.BODY
  )

  return {
    activeView,
    setActiveView,
  }
}
