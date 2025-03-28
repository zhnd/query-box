export type UIThemeMode = 'dark' | 'light' | 'system'
export type UIResolvedUIThemeMode = 'dark' | 'light'

export enum SettingsCategories {
  UI_THEME = 'ui_theme',
  APP_SIDEBAR = 'app_sidebar',
  APP_STATE = 'app_state',
}

export enum SettingsValueTypes {
  STRING = 'string',
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  ARRAY = 'array',
  JSON = 'json',
}
