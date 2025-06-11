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
import {
  handleGoToGraphqlFieldDefinition,
  setupGraphQLSchemaInMonaco,
  updateGraphQLSchema,
} from './utils'

export interface QueryEditorProps {
  initialValue?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
  schema: GraphQLSchema | null
  onViewDefinition?: (fieldName: string) => void
}

export function useService(props: QueryEditorProps) {
  const { onChange, initialValue, value, schema, onViewDefinition } = props

  const editorContainerElementRef = useRef<HTMLDivElement>(null)
  const editorInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  )
  const initializingRef = useRef(false)
  const monacoGraphQLApiRef = useRef<MonacoGraphQLAPI | null>(null)

  const { resolvedThemeMode } = useThemeModeStore()

  const init = async () => {
    if (editorInstanceRef.current || initializingRef.current || !schema) return
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

    // add Go to Definition action
    editorInstance.addAction({
      id: 'graphql-provide-definition',
      label: 'Go to Definition F12',
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1,
      run: (editor) => {
        handleGoToGraphqlFieldDefinition({ schema, editor, onViewDefinition })
      },
    })

    // register custom Go to Definition command
    // This allows users to use F12 on field names to navigate to their definitions
    editorInstance.addCommand(monaco.KeyCode.F12, () => {
      handleGoToGraphqlFieldDefinition({
        schema,
        editor: editorInstance,
        onViewDefinition,
      })
    })

    // Handle mouse down events to go to GraphQL field definition
    // when Ctrl/Cmd key is pressed
    // and the target is a text content
    // This allows users to click on field names to navigate to their definitions
    editorInstance.onMouseDown((e) => {
      const { event, target } = e
      if (
        (event.ctrlKey || event.metaKey) &&
        target.type === monaco.editor.MouseTargetType.CONTENT_TEXT
      ) {
        handleGoToGraphqlFieldDefinition({
          schema,
          editor: editorInstance,
          position: target.position,
          onViewDefinition,
        })
      }
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
  }, [schema])

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
