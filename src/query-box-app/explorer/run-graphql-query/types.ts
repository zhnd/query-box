import { QueryEditorCodeLensOperation } from '@/components/query-editor/types'
import { RunGraphQLQueryParams } from '../request/types'

export interface runGraphQLQueryProps {
  isPending: boolean
  handleRunGraphQLQuery: (data?: RunGraphQLQueryParams) => void
  codelensOperations: QueryEditorCodeLensOperation[]
}

export const RUN_BUTTON_TEXT = 'Run'
