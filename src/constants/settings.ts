import { SettingsCategories, SettingsValueTypes } from '@/types'
export const SettingsKeys = {
  UI: {
    THEME: {
      MODE: 'ui.theme.mode',
    },
  },
}

export type SettingsKeysType = keyof typeof SettingsKeys

export const SettingsMetadata = {
  [SettingsKeys.UI.THEME.MODE]: {
    description: 'Application theme mode (light/dark/system)',
    category: SettingsCategories.UI_THEME,
    valueType: SettingsValueTypes.STRING,
  },
}
