import { getCurrentWindow } from '@tauri-apps/api/window'
import { platform } from '@tauri-apps/plugin-os'
import { useEffect, useState } from 'react'

export const useTitleBarService = () => {
  const currentPlatform = platform()
  const appWindow = getCurrentWindow()
  const [isHovering, setIsHovering] = useState<string | null>(null)
  const [isWindowFocused, setIsWindowFocused] = useState(true)

  useEffect(() => {
    const setupFocusListeners = async () => {
      const unListenFocus = await getCurrentWindow().onFocusChanged(
        ({ payload: focused }) => {
          console.log('Focus changed, window is focused? ' + focused)
          setIsWindowFocused(focused)
        }
      )

      return () => {
        unListenFocus()
      }
    }

    setupFocusListeners()
  }, [appWindow])

  const minimize = () => appWindow.minimize()
  const maximize = () => appWindow.toggleMaximize()
  const close = () => appWindow.close()

  return {
    currentPlatform,
    isHovering,
    isWindowFocused,
    minimize,
    maximize,
    close,
    setIsHovering,
  }
}
