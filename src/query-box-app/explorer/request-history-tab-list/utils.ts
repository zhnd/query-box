import { RequestHistoryBridge } from '@/bridges'
import { HttpMethod } from '@/generated/typeshare-types'

export async function createEmptyRequestHistory(params: {
  endpoint?: {
    id: string
  } | null
}) {
  const { endpoint } = params
  if (!endpoint || !endpoint.id) {
    throw new Error('Endpoint ID is required to create a request history.')
  }
  return await RequestHistoryBridge.createRequestHistory({
    endpoint_id: endpoint.id,
    method: HttpMethod.POST,
  })
}
