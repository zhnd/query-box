import {
  CreateEndpointDto,
  DeleteEndpointDto,
  Endpoint,
  EndpointFilter,
  PaginatedResponse,
  UpdateEndpointDto,
} from '@/generated/typeshare-types'
import { invoke } from '@tauri-apps/api/core'

export class EndpointBridge {
  static async listEndpoints(
    filter: EndpointFilter
  ): Promise<PaginatedResponse<Endpoint>> {
    try {
      return await invoke<PaginatedResponse<Endpoint>>('get_all_endpoints', {
        filter,
      })
    } catch (error) {
      console.error('Failed to list endpoints:', error)
      throw error
    }
  }
  static async getEndpointById(id: string): Promise<Endpoint> {
    try {
      return await invoke<Endpoint>('get_endpoint_by_id', {
        id,
      })
    } catch (error) {
      console.error('Failed to get endpoint by ID:', error)
      throw error
    }
  }
  static async createEndpoint(dto: CreateEndpointDto): Promise<Endpoint> {
    try {
      return await invoke<Endpoint>('create_endpoint', {
        dto,
      })
    } catch (error) {
      console.error('Failed to create endpoint:', error)
      throw error
    }
  }

  static async updateEndpoint(dto: UpdateEndpointDto): Promise<Endpoint> {
    try {
      return await invoke<Endpoint>('update_endpoint', {
        dto,
      })
    } catch (error) {
      console.error('Failed to update endpoint:', error)
      throw error
    }
  }

  static async deleteEndpoint(dto: DeleteEndpointDto): Promise<void> {
    try {
      return await invoke<void>('delete_endpoint', {
        dto,
      })
    } catch (error) {
      console.error('Failed to delete endpoint:', error)
      throw error
    }
  }
}
