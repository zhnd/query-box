import { relaunch } from '@tauri-apps/plugin-process'
import { check } from '@tauri-apps/plugin-updater'
import { useCallback, useEffect, useState } from 'react'

export const usePageMenubarUpdaterService = () => {
  const [downloadFinished, setDownloadFinished] = useState(false)

  const checkAndDownloadUpdate = useCallback(async () => {
    const update = await check()
    if (update) {
      await update.downloadAndInstall()
      setDownloadFinished(true)
    }
  }, [])

  useEffect(() => {
    checkAndDownloadUpdate()
  }, [])

  const handleInstallUpdate = useCallback(async () => {
    await relaunch()
    setDownloadFinished(false)
  }, [])

  return {
    downloadFinished,
    handleInstallUpdate,
  }
}
