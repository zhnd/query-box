import { GraphQLResponse } from '@/generated/typeshare-types'
import { invoke } from '@tauri-apps/api/core'

export class GraphQLBridge {
  static async send_graphql_request(data: { endpoint: string; query: string }) {
    try {
      return await invoke<GraphQLResponse>('send_graphql_request', data)
    } catch (error) {
      console.error('Failed to send GraphQL request:', error)
      throw error
    }
  }
}
