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
  static async getSetting(key: SettingsKeysType) {
    try {
      return await invoke<Setting>('get_setting', { key })
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
