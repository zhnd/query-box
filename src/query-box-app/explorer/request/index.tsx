import { QueryEditor } from '@/components/query-editor'
import { memo } from 'react'
import { RunGraphQLQuery } from '../run-graphql-query'
import { useRequestService } from './use-service'

export const Request = memo(function Request() {
  const service = useRequestService()

  if (!service.activeRequestHistory || !service.currentPageSelectedEndpoint) {
    return null
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center px-2 py-1 border-b">
        <div className="flex items-center text-sm font-medium">Operation</div>

        <RunGraphQLQuery
          isPending={service.isPending}
          codelensOperations={service.codeLensOperations}
          handleRunGraphQLQuery={service.handleRunGraphQLQuery}
        />
      </div>
      <QueryEditor
        className="h-full"
        schema={service.schema}
        onChange={service.handleQueryUpdate}
        initialValue={service.activeRequestHistory.query ?? ''}
        value={service.activeRequestHistory.query ?? ''}
        onViewDefinition={service.handleGoToGraphqlFieldDefinition}
        runGraphQLQuery={service.handleRunGraphQLQuery}
        onUpdateLensOperations={service.handleUpdateCodeLensOperations}
      />
    </div>
  )
})
