import { githubDarkTheme, githubLightTheme } from '@/constants'
import { useThemeModeStore } from '@/stores'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { useEffect, useRef } from 'react'

export interface JsonViewerProps {
  value?: string
}

export const useJsonViewerService = (props: JsonViewerProps) => {
  const { value } = props
  const viewContainerElementRef = useRef<HTMLDivElement>(null)

  const editorInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  )
  const initializingRef = useRef(false)

  const { resolvedThemeMode } = useThemeModeStore()

  const init = () => {
    if (
      !viewContainerElementRef.current ||
      editorInstanceRef.current ||
      initializingRef.current
    )
      return
    initializingRef.current = true

    monaco.editor.defineTheme('github-light', githubLightTheme)
    monaco.editor.defineTheme('github-dark', githubDarkTheme)

    // compute the initial value
    const initialValue = formatJsonString(value)

    const editorInstance = monaco.editor.create(
      viewContainerElementRef.current,
      {
        value: initialValue,
        language: 'json',
        readOnly: true,
        wordWrap: 'on',
        wrappingIndent: 'indent',
        scrollbar: {
          vertical: 'hidden',
          horizontal: 'hidden',
          verticalScrollbarSize: 8,
          useShadows: false,
          verticalSliderSize: 8,
        },
        minimap: {
          enabled: false,
        },
        theme: resolvedThemeMode === 'dark' ? 'github-dark' : 'github-light',
        automaticLayout: true,
      }
    )

    editorInstanceRef.current = editorInstance

    // check if the editor is initialized and layout is done
    // if not, wait for the layout to be done
    // and then set the initializingRef to false
    const disposable = editorInstance.onDidLayoutChange(() => {
      initializingRef.current = false

      // dispose the event listener to avoid memory leaks
      // and to avoid multiple calls to this function
      // when the editor is resized or when the layout is changed
      // this will be called only once when the editor is initialized
      disposable.dispose()
    })
  }

  useEffect(() => {
    init()
    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.dispose()
        editorInstanceRef.current = null
        initializingRef.current = false
      }
    }
  }, [])

  useEffect(() => {
    editorInstanceRef.current?.updateOptions({
      theme: resolvedThemeMode === 'dark' ? 'github-dark' : 'github-light',
    })
  }, [resolvedThemeMode])

  useEffect(() => {
    // if the editor is not initialized or if it is still initializing, return
    // this will avoid multiple calls to this function
    if (!editorInstanceRef.current || initializingRef.current) return

    const formattedData = formatJsonString(value)
    const currentValue = editorInstanceRef.current?.getValue()

    // if the current value is the same as the formatted data, return
    if (currentValue === formattedData) return

    editorInstanceRef.current?.setValue(formattedData ?? '')
    editorInstanceRef.current.revealPosition({ lineNumber: 1, column: 1 })
  }, [value])

  return {
    viewContainerElementRef,
  }
}

/**
 * Formats a JSON string.
 *
 * @param data The JSON string to format.
 * @returns The formatted JSON string or the original data if parsing fails.
 */
const formatJsonString = (data?: string) => {
  if (!data) return ''
  try {
    const jsonObject = JSON.parse(data)
    return JSON.stringify(jsonObject, null, '\t')
  } catch (error) {
    console.error('Failed to parse JSON:', error)
    return data
  }
}
