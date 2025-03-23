import { CreateEndpointDto, Endpoint } from '@/generated/typeshare-types'
import { invoke } from '@tauri-apps/api/core'

export class EndpointBridge {
  static async createEndpoint(dto: CreateEndpointDto): Promise<Endpoint> {
    try {
      const endpoint = await invoke<Endpoint>('create_endpoint', {
        dto,
      })

      if (!endpoint) {
        throw new Error('Failed to create endpoint')
      }

      return endpoint
    } catch (error) {
      console.error('Failed to create endpoint:', error)
      throw error
    }
  }
}
