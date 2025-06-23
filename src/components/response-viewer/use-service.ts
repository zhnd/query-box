import { HttpResponse } from '@/generated/typeshare-types'
import { useState } from 'react'
import { ResponseViewType } from './constants'

export interface ResponseViewerProps {
  data: HttpResponse | null
}

export const useResponseViewerService = () => {
  const [activeView, setActiveView] = useState<ResponseViewType>(
    ResponseViewType.BODY
  )

  return {
    activeView,
    setActiveView,
  }
}
