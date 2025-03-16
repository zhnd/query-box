import { SettingsKeysType } from '@/constants'
import { SettingsCategories, SettingsValueTypes } from '@/types'
import { invoke } from '@tauri-apps/api/core'

export interface Setting {
  key: SettingsKeysType
  value: string
  value_type: SettingsValueTypes
  category: SettingsCategories
  description?: string
}

export interface UpsertSettingOptions {
  value_type: SettingsValueTypes
  category: SettingsCategories
  description?: string
}

export class SettingsBridge {
  static parseSettingValue<T>(
    value: string,
    value_type: SettingsValueTypes
  ): T {
    try {
      switch (value_type) {
        case SettingsValueTypes.BOOLEAN:
          return (value === 'true') as unknown as T

        case SettingsValueTypes.NUMBER:
          return Number(value) as unknown as T

        case SettingsValueTypes.ARRAY:
        case SettingsValueTypes.JSON:
          return JSON.parse(value) as T

        case SettingsValueTypes.STRING:
        default:
          return value as unknown as T
      }
    } catch (error) {
      console.error('Failed to parse setting value:', error)
      return value as unknown as T
    }
  }

  static async getSetting<T>(key: SettingsKeysType) {
    try {
      const setting = await invoke<Setting>('get_setting', { key })
      return {
        ...setting,
        value: this.parseSettingValue<T>(setting.value, setting.value_type),
      }
    } catch (error) {
      console.error('Error fetching setting:', error)
      throw error
    }
  }

  static async upsertSetting(
    key: SettingsKeysType,
    value: string,
    options?: UpsertSettingOptions
  ) {
    try {
      return await invoke<void>('upsert_setting', { key, value, options })
    } catch (error) {
      console.error('Error updating setting:', error)
      throw error
    }
  }

  static async removeSetting(key: string) {
    try {
      return await invoke('remove_setting', { key })
    } catch (error) {
      console.error('Error removing setting:', error)
      throw error
    }
  }
}
