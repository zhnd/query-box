import { githubDarkTheme, githubLightTheme } from '@/constants'
import { useThemeModeStore } from '@/stores'
import { GraphQLSchema } from 'graphql'
import _ from 'lodash'
import { Uri } from 'monaco-editor'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { MonacoGraphQLAPI } from 'monaco-graphql/esm/api.js'
import parserGraphql from 'prettier/parser-graphql'
import prettier from 'prettier/standalone'
import { useEffect, useRef } from 'react'
import { QUERY_EXAMPLE } from './constants'
import { QueryEditorProps, RunGraphQLQueryArguments } from './types'
import {
  getProvideCodeLenses,
  handleGoToGraphqlFieldDefinition,
  setupGraphQLSchemaInMonaco,
  updateGraphQLSchema,
} from './utils'

export function useService(props: QueryEditorProps) {
  const {
    onChange,
    initialValue,
    value,
    schema,
    onViewDefinition,
    runGraphQLQuery,
    onUpdateLensOperations,
  } = props

  const editorContainerElementRef = useRef<HTMLDivElement>(null)
  const editorInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  )
  const initializingRef = useRef(false)
  const monacoGraphQLApiRef = useRef<MonacoGraphQLAPI | null>(null)
  const schemaRef = useRef<GraphQLSchema | null>(schema)
  const disposablesRef = useRef<monaco.IDisposable[]>([])

  const { resolvedThemeMode } = useThemeModeStore()

  // Debounced function to handle value changes
  //  this props don't change frequently, so we can use a ref to store the debounced function
  // and avoid unnecessary re-creations on every render
  const debouncedValueChange = useRef(
    _.debounce((value: string) => {
      onChange?.(value)
    }, 500)
  ).current

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

    const onDidChangeContentDisposable = queryModel.onDidChangeContent(
      (event: monaco.editor.IModelContentChangedEvent) => {
        if (event.isFlush) return // Skip flush events
        debouncedValueChange(queryModel.getValue())
      }
    )
    disposablesRef.current.push(onDidChangeContentDisposable)

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

    const documentFormattingEditDisposable =
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
    disposablesRef.current.push(documentFormattingEditDisposable)

    const codeLensDisposable = monaco.languages.registerCodeLensProvider(
      'graphql',
      {
        provideCodeLenses(model) {
          const codeLensData = getProvideCodeLenses({ model })
          onUpdateLensOperations?.({
            codeLensOperations: codeLensData?.codeLensOperations ?? null,
          })
          return {
            lenses: codeLensData?.codeLens ?? [],
            dispose: () => {},
          }
        },
        resolveCodeLens(_, codeLens) {
          return codeLens
        },
      }
    )

    disposablesRef.current.push(codeLensDisposable)

    const commandDisposable = monaco.editor.registerCommand(
      'runGraphQLQuery',
      (_, args: RunGraphQLQueryArguments) => {
        runGraphQLQuery?.(args)
        return null
      }
    )
    disposablesRef.current.push(commandDisposable)
    // add Go to Definition action
    editorInstance.addAction({
      id: 'graphql-provide-definition',
      label: 'Go to Definition F12',
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1,
      run: (editor) => {
        handleGoToGraphqlFieldDefinition({
          schema: schemaRef.current,
          editor,
          onViewDefinition,
        })
      },
    })

    // register custom Go to Definition command
    // This allows users to use F12 on field names to navigate to their definitions
    editorInstance.addCommand(monaco.KeyCode.F12, () => {
      handleGoToGraphqlFieldDefinition({
        schema: schemaRef.current,
        editor: editorInstance,
        onViewDefinition,
      })
    })

    // Handle mouse down events to go to GraphQL field definition
    // when Ctrl/Cmd key is pressed
    // and the target is a text content
    // This allows users to click on field names to navigate to their definitions
    const mouseDownDisposable = editorInstance.onMouseDown((e) => {
      const { event, target } = e
      if (
        (event.ctrlKey || event.metaKey) &&
        target.type === monaco.editor.MouseTargetType.CONTENT_TEXT
      ) {
        handleGoToGraphqlFieldDefinition({
          schema: schemaRef.current,
          editor: editorInstance,
          position: target.position,
          onViewDefinition,
        })
      }
    })
    disposablesRef.current.push(mouseDownDisposable)

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
      // cancel the debounced of value change
      debouncedValueChange.cancel()
      if (editorInstanceRef.current) {
        // Dispose the editor instance
        editorInstanceRef.current.dispose()
        editorInstanceRef.current = null
        initializingRef.current = false

        // Dispose all registered Monaco commands and providers
        disposablesRef.current.forEach((disposable) => {
          disposable.dispose()
        })
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
    schemaRef.current = schema
    updateGraphQLSchema({ schema, monacoGraphQLApi }).catch((error) => {
      console.error('Error updating GraphQL schema:', error)
    })
  }, [schema])

  return { editorContainerElementRef }
}
