import { githubDarkTheme, githubLightTheme } from '@/constants'
import { useThemeModeStore } from '@/stores'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { useEffect, useRef } from 'react'

export interface JsonViewerProps {
  data?: string
}

export const useJsonViewerService = (props: JsonViewerProps) => {
  const { data } = props
  const viewContainerElementRef = useRef<HTMLDivElement>(null)

  const editorInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  )
  const initializingRef = useRef(false)

  const { resolvedThemeMode } = useThemeModeStore()

  const init = async () => {
    if (
      !viewContainerElementRef.current ||
      editorInstanceRef.current ||
      initializingRef.current
    )
      return
    initializingRef.current = true

    monaco.editor.defineTheme('github-light', githubLightTheme)
    monaco.editor.defineTheme('github-dark', githubDarkTheme)

    const editorInstance = monaco.editor.create(
      viewContainerElementRef.current,
      {
        value: JSON.stringify(
          {
            name: 'GraphQL',
            description: 'GraphQL API',
            url: 'https://api.example.com/graphql',
          },
          null,
          '\t'
        ),
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
    initializingRef.current = false
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
    if (editorInstanceRef.current && data) {
      try {
        // 如果 data 是 JSON 字符串，尝试格式化它
        let formattedData = data
        try {
          const jsonObject = JSON.parse(data)
          formattedData = JSON.stringify(jsonObject, null, '\t')
        } catch {
          // 如果解析失败，使用原始数据
        }

        // 使用 setValue 更新编辑器内容
        editorInstanceRef.current.setValue(formattedData)

        // 可选：重置视图位置到顶部
        editorInstanceRef.current.revealPosition({ lineNumber: 1, column: 1 })
      } catch (error) {
        console.error('Failed to update editor value:', error)
      }
    }
  }, [data])

  return {
    viewContainerElementRef,
  }
}
