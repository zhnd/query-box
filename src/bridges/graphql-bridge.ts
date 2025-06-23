import {
  HttpResponse,
  SendGraphQLRequestPayload,
} from '@/generated/typeshare-types'
import { invoke } from '@tauri-apps/api/core'

export class GraphQLBridge {
  static async send_graphql_request(data: SendGraphQLRequestPayload) {
    console.debug('Sending GraphQL request:', data)
    try {
      return await invoke<HttpResponse>('send_graphql_request', {
        data,
      })
    } catch (error) {
      console.error('Failed to send GraphQL request:', error)
      throw error
    }
  }
}
