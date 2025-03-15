import { SettingsBridge, UpsertSettingOptions } from '@/bridges'
import { SettingsKeysType } from '@/constants'
import { StorageValue } from 'zustand/middleware'

export interface SettingsStorageOptions<T> {
  valueKey?: keyof T
  defaultValue?: Partial<T>
  upsertOptions?: UpsertSettingOptions
  serialize?: {
    toValue?: (value: StorageValue<T>) => string
    fromValue?: (value: string) => Partial<T>
  }
}

export function createSettingsStorage<T>(options: SettingsStorageOptions<T>) {
  const { serialize, valueKey, defaultValue, upsertOptions } = options

  const getItem = async (name: string): Promise<StorageValue<T> | null> => {
    try {
      const setting = await SettingsBridge.getSetting(name as SettingsKeysType)
      if (setting?.value) {
        const newValue = {
          state: serialize?.fromValue
            ? serialize.fromValue(setting.value)
            : {
                [valueKey as string]: setting.value,
              },
        } as StorageValue<T>
        return newValue
      }

      const defaultStateValue = { state: defaultValue as T } as StorageValue<T>
      return defaultStateValue
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
      const upsertValue = serialize?.toValue
        ? serialize.toValue(value)
        : valueKey
          ? String(value.state[valueKey])
          : JSON.stringify(value.state)

      await SettingsBridge.upsertSetting(
        name as SettingsKeysType,
        upsertValue,
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
