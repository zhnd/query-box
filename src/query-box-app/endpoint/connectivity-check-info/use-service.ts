import { useEffect, useRef } from 'react'

interface ConnectivityCheckInfoProps {
  checkResult: {
    status?: 'connected' | 'disconnected'
    error?: string
  } | null
  loading: boolean
}

export function useConnectivityCheckService(props: ConnectivityCheckInfoProps) {
  const { checkResult } = props
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (checkResult?.error) {
      // Scroll to the top of the wrapper when there is an error
      wrapperRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [checkResult])

  return {
    wrapperRef,
  }
}
