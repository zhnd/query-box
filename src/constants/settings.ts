import { SettingsCategories, SettingsValueTypes } from '@/types'
export const SettingsKeys = {
  UI: {
    THEME: {
      MODE: 'ui.theme.mode',
    },
    SIDEBAR: {
      COLLAPSED: 'ui.sidebar.collapsed',
      ACTIVE_ITEM: 'ui.sidebar.active_item',
    },
  },
  APP_STATE: {
    SELECTED_ENDPOINT: 'app_state.selected_endpoint',
    EXPLORER_DOCUMENTATION_COLLAPSED:
      'app_state.explorer_documentation_collapsed',
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
