import { SettingsBridge, UpsertSettingOptions } from '@/bridges'
import { SettingsKeysType } from '@/constants'
import { StorageValue } from 'zustand/middleware'

export interface SettingsStorageOptions<T> {
  valueKey: keyof T
  defaultValue?: Partial<T>
  upsertOptions: UpsertSettingOptions
}

export function createSettingsStorage<T extends object>(
  options: SettingsStorageOptions<T>
) {
  const { defaultValue, upsertOptions, valueKey } = options

  const getItem = async (name: string): Promise<StorageValue<T> | null> => {
    try {
      const setting = await SettingsBridge.getSetting<T>(
        name as SettingsKeysType
      )
      return {
        state: {
          [valueKey]: setting?.value ?? defaultValue,
        },
      } as StorageValue<T>
    } catch (error) {
      console.error(`[SettingsStorage] Error getting setting ${name}:`, error)
      return null
    }
  }

  const setItem = async (
    name: string,
    value: StorageValue<T>
  ): Promise<void> => {
    try {
      await SettingsBridge.upsertSetting<T[keyof T]>(
        name as SettingsKeysType,
        value.state[valueKey],
        upsertOptions
      )
    } catch (error) {
      console.error(`[SettingsStorage] Error setting ${name}:`, error)
    }
  }

  const removeItem = async (name: string): Promise<void> => {
    try {
      await SettingsBridge.removeSetting(name as SettingsKeysType)
    } catch (error) {
      console.error(`[SettingsStorage] Error removing ${name}:`, error)
    }
  }

  return {
    getItem,
    setItem,
    removeItem,
  }
}
