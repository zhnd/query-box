import { createGraphiQLFetcher } from '@graphiql/toolkit'
import {
  buildClientSchema,
  getIntrospectionQuery,
  GraphQLSchema,
  IntrospectionQuery,
} from 'graphql'
import { debounce } from 'lodash'
import { languages, Uri } from 'monaco-editor'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { initializeMode } from 'monaco-graphql/initializeMode'
import parserGraphql from 'prettier/parser-graphql'
import prettier from 'prettier/standalone'
import { useEffect, useRef } from 'react'

export function useService() {
  const editorContainerElementRef = useRef<HTMLDivElement>(null)
  const editorInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  )
  const initializingRef = useRef(false)

  const init = async () => {
    if (editorInstanceRef.current || initializingRef.current) return
    initializingRef.current = true

    const defaultOperations =
      localStorage.getItem('operations') ??
      `
# cmd/ctrl + return/enter will execute the op,
# same in variables editor below
# also available via context menu & f1 command palette

query($limit: Int!) {
    payloads(limit: $limit) {
        customer
    }
}
`

    const getOrCreateModel = (uri: string, value: string) => {
      return (
        monaco.editor.getModel(Uri.file(uri)) ??
        monaco.editor.createModel(value, uri.split('.').pop(), Uri.file(uri))
      )
    }

    const queryModel = getOrCreateModel('operation.graphql', defaultOperations)

    queryModel.onDidChangeContent(
      debounce(() => {
        console.log('content changed', queryModel.getValue())
      }, 600)
    )

    const editorInstance = monaco.editor.create(
      editorContainerElementRef.current!,
      {
        model: queryModel,
        language: 'graphql',
        minimap: {
          enabled: false,
        },
      }
    )

    languages.registerDocumentFormattingEditProvider('graphql', {
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
          schema: await getSchema(),
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

  return { editorContainerElementRef }
}

async function getSchema(): Promise<GraphQLSchema> {
  const fetcher = createGraphiQLFetcher({
    url: 'https://countries.trevorblades.com',
    // Add WebSocket options or disable subscriptions
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
