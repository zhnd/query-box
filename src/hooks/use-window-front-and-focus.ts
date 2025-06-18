import { Window } from '@tauri-apps/api/window'
import { useCallback, useEffect, useRef } from 'react'

/**
 * This hook brings the current window to the front and focuses it.
 * It also sets the window to always on top for a brief moment.
 *
 * Problem: when relaunching the app, the window may not come to the front
 */
export const useWindowFrontAndFocus = () => {
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const setAction = useCallback(async () => {
    try {
      const appWindow = Window.getCurrent()

      // Show the window
      await appWindow.show()

      // Temporarily set the window to always on top
      await appWindow.setAlwaysOnTop(true)

      // Focus the window
      await appWindow.setFocus()

      // Reset always-on-top after 300ms
      timerRef.current = setTimeout(() => {
        appWindow.setAlwaysOnTop(false).catch((error) => {
          console.error('Failed to reset always-on-top:', error)
        })
      }, 300)
    } catch (error) {
      console.error('Failed to bring window to front and focus:', error)
    }
  }, [])

  useEffect(() => {
    setAction()

    return () => {
      // Clear the timer when the component unmounts
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [setAction])
}
