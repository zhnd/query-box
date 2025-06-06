import { githubDarkTheme, githubLightTheme } from '@/constants'
import { useThemeModeStore } from '@/stores'
import { GraphQLSchema } from 'graphql'
import { debounce } from 'lodash'
import { Uri } from 'monaco-editor'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { MonacoGraphQLAPI } from 'monaco-graphql/esm/api.js'
import parserGraphql from 'prettier/parser-graphql'
import prettier from 'prettier/standalone'
import { useEffect, useRef } from 'react'
import { QUERY_EXAMPLE } from './constants'
import { setupGraphQLSchemaInMonaco, updateGraphQLSchema } from './utils'

export interface QueryEditorProps {
  initialValue?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
  schema: GraphQLSchema | null
}

export function useService(props: QueryEditorProps) {
  const { onChange, initialValue, value, schema } = props

  const editorContainerElementRef = useRef<HTMLDivElement>(null)
  const editorInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  )
  const initializingRef = useRef(false)
  const monacoGraphQLApiRef = useRef<MonacoGraphQLAPI | null>(null)

  const { resolvedThemeMode } = useThemeModeStore()

  const init = async () => {
    if (editorInstanceRef.current || initializingRef.current) return
    initializingRef.current = true

    monaco.editor.defineTheme('github-light', githubLightTheme)
    monaco.editor.defineTheme('github-dark', githubDarkTheme)

    const defaultOperations = initialValue || QUERY_EXAMPLE

    const getOrCreateModel = (uri: string, value: string) => {
      return (
        monaco.editor.getModel(Uri.file(uri)) ??
        monaco.editor.createModel(value, uri.split('.').pop(), Uri.file(uri))
      )
    }

    const queryModel = getOrCreateModel('operation.graphql', defaultOperations)

    queryModel.onDidChangeContent(
      debounce(() => {
        onChange?.(queryModel.getValue())
      }, 600)
    )

    const editorInstance = monaco.editor.create(
      editorContainerElementRef.current!,
      {
        model: queryModel,
        language: 'graphql',
        scrollbar: {
          vertical: 'hidden',
          horizontal: 'hidden',
          verticalScrollbarSize: 8,
          useShadows: false,
          verticalSliderSize: 8,
        },
        tabSize: 2,
        minimap: {
          enabled: false,
        },
        theme: resolvedThemeMode === 'dark' ? 'github-dark' : 'github-light',
        automaticLayout: true,
      }
    )

    monaco.languages.registerDocumentFormattingEditProvider('graphql', {
      provideDocumentFormattingEdits: async (modal) => {
        try {
          const formattedText = await prettier.format(modal.getValue(), {
            parser: 'graphql',
            plugins: [parserGraphql],
            printWidth: 80,
            tabWidth: 2,
            useTabs: false,
            singleQuote: true,
          })
          return [
            {
              range: modal.getFullModelRange(),
              text: formattedText,
            },
          ]
        } catch (error) {
          console.error('Formatting error:', error)
          return []
        }
      },
    })

    // Initialize GraphQL mode with the endpoint URL
    monacoGraphQLApiRef.current = await setupGraphQLSchemaInMonaco({
      schema,
    })

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
    const currentValue = editorInstanceRef.current?.getValue()
    if (currentValue === value) return
    editorInstanceRef.current?.setValue(value ?? '')
  }, [value])

  useEffect(() => {
    const monacoGraphQLApi = monacoGraphQLApiRef.current
    if (
      !schema ||
      initializingRef.current ||
      !editorInstanceRef.current ||
      !monacoGraphQLApi
    ) {
      return
    }

    updateGraphQLSchema({ schema, monacoGraphQLApi }).catch((error) => {
      console.error('Error updating GraphQL schema:', error)
    })
  }, [schema])

  return { editorContainerElementRef }
}
