import {
  CreateRequestHistoryDto,
  DeleteRequestHistoryDto,
  RequestHistory,
  RequestHistoryFilter,
  SetActiveRequestHistoryDto,
  UpdateRequestHistoryDto,
} from '@/generated/typeshare-types'
import { invoke } from '@tauri-apps/api/core'

export class RequestHistoryBridge {
  static async listRequestHistories(
    filter: RequestHistoryFilter
  ): Promise<RequestHistory[]> {
    try {
      return await invoke<RequestHistory[]>('get_all_request_histories', {
        filter,
      })
    } catch (error) {
      console.error('Failed to list request histories:', error)
      throw error
    }
  }

  static async createRequestHistory(
    dto: CreateRequestHistoryDto
  ): Promise<RequestHistory> {
    try {
      return await invoke<RequestHistory>('create_request_history', {
        dto,
      })
    } catch (error) {
      console.error('Failed to create request history:', error)
      throw error
    }
  }

  static async updateRequestHistory(
    dto: UpdateRequestHistoryDto
  ): Promise<RequestHistory> {
    try {
      return await invoke<RequestHistory>('update_request_history', {
        dto,
      })
    } catch (error) {
      console.error('Failed to update request history:', error)
      throw error
    }
  }

  static async deleteRequestHistory(
    dto: DeleteRequestHistoryDto
  ): Promise<void> {
    try {
      await invoke<void>('delete_request_history', {
        dto,
      })
    } catch (error) {
      console.error('Failed to delete request history:', error)
      throw error
    }
  }

  static async setActiveRequestHistory(
    dto: SetActiveRequestHistoryDto
  ): Promise<RequestHistory | null> {
    try {
      return await invoke<RequestHistory | null>('set_active_request_history', {
        dto,
      })
    } catch (error) {
      console.error('Failed to set active request history:', error)
      throw error
    }
  }
}
