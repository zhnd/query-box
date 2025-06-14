import { GraphQLResponse } from '@/generated/typeshare-types'
import { useState } from 'react'
import { ResponseViewType } from './constants'

export interface ResponseViewerProps {
  data: GraphQLResponse | null
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
