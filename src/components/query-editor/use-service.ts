import { githubDarkTheme, githubLightTheme } from '@/constants'
import { useThemeModeStore } from '@/stores'
import { createGraphiQLFetcher } from '@graphiql/toolkit'
import {
  buildClientSchema,
  getIntrospectionQuery,
  GraphQLSchema,
  IntrospectionQuery,
} from 'graphql'
import { debounce } from 'lodash'
import { Uri } from 'monaco-editor'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { initializeMode } from 'monaco-graphql/initializeMode'
import parserGraphql from 'prettier/parser-graphql'
import prettier from 'prettier/standalone'
import { useEffect, useRef } from 'react'
import { QUERY_EXAMPLE } from './constants'

export interface QueryEditorProps {
  endpointUrl: string
  initialValue?: string
  value?: string
  onChange?: (value: string) => void
}

export function useService(props: QueryEditorProps) {
  const { onChange, initialValue, value, endpointUrl } = props

  const editorContainerElementRef = useRef<HTMLDivElement>(null)
  const editorInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  )
  const initializingRef = useRef(false)

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

    initializeMode({
      diagnosticSettings: {
        validateVariablesJSON: {
          [Uri.file('operation.graphql').toString()]: [
            Uri.file('variables.json').toString(),
          ],
        },
        jsonDiagnosticSettings: {
          validate: true,
          schemaValidation: 'error',
          // set these again, because we are entirely re-setting them here
          allowComments: true,
          trailingCommas: 'ignore',
        },
      },
      schemas: [
        {
          schema: await getSchema({
            endpointUrl,
          }),
          uri: 'myschema.graphql',
        },
      ],
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

  return { editorContainerElementRef }
}

async function getSchema(params: {
  endpointUrl: string
}): Promise<GraphQLSchema> {
  const { endpointUrl } = params
  const fetcher = createGraphiQLFetcher({
    url: endpointUrl,
  })

  const data = await fetcher({
    query: getIntrospectionQuery(),
    operationName: 'IntrospectionQuery',
  })
  const introspectionJSON =
    'data' in data && (data.data as unknown as IntrospectionQuery)

  if (!introspectionJSON) {
    throw new Error(
      'this demo does not support subscriptions or http multipart yet'
    )
  }
  return buildClientSchema(introspectionJSON)
}
