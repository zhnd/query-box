import { SettingsBridge } from '@/bridges'
import { SettingsKeysType } from '@/constants'
import { SettingsCategories } from '@/types'
import { StateStorage, StorageValue } from 'zustand/middleware'

export interface SettingsStorageOptions<T> {
  settingKey: string
  category: SettingsCategories
  serialize?: {
    toValue?: (state: T) => string
    fromValue?: (value: string) => Partial<T>
  }
  valueField?: keyof T
}

export function createSettingsStorage<T>(
  options: SettingsStorageOptions<T>
): StateStorage {
  const { category, serialize, valueField } = options

  const getItem = async (name: string): Promise<string | null> => {
    try {
      const setting = await SettingsBridge.getSetting(name as SettingsKeysType)

      if (setting?.value) {
        return JSON.stringify({
          state: serialize?.fromValue
            ? serialize.fromValue(setting.value)
            : valueField
              ? ({ [valueField]: setting.value } as Partial<T>)
              : JSON.parse(setting.value),
        })
      }

      return null
    } catch (error) {
      console.error(`[SettingsStorage] Error getting setting ${name}:`, error)
      return null
    }
  }

  const setItem = async (name: string, value: string): Promise<void> => {
    try {
      const parsedValue = JSON.parse(value) as StorageValue<T>
      const state = parsedValue.state

      let settingValue: string
      if (serialize?.toValue) {
        settingValue = serialize.toValue(state)
      } else if (valueField) {
        settingValue = String(state[valueField])
      } else {
        settingValue = JSON.stringify(state)
      }

      await SettingsBridge.upsertSetting(
        name as SettingsKeysType,
        settingValue,
        {
          value_type: valueType,
          category,
          description: description,
        }
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
