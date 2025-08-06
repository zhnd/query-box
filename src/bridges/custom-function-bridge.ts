import {
  CustomFunction,
  CustomFunctionFilter,
  PaginatedResponse,
} from '@/generated/typeshare-types'
import { invoke } from '@tauri-apps/api/core'

export class CustomFunctionBridge {
  static async listCustomFunctions(
    filter: CustomFunctionFilter
  ): Promise<PaginatedResponse<CustomFunction>> {
    try {
      return await invoke<PaginatedResponse<CustomFunction>>(
        'get_all_custom_functions',
        {
          filter,
        }
      )
    } catch (error) {
      console.error('Failed to list custom functions:', error)
      throw error
    }
  }
}
