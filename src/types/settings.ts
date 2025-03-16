export type UIThemeMode = 'dark' | 'light' | 'system'
export type UIResolvedUIThemeMode = 'dark' | 'light'

export enum SettingsCategories {
  UI_THEME = 'ui_theme',
  APP_SIDEBAR = 'app_sidebar',
}

export enum SettingsValueTypes {
  STRING = 'string',
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  ARRAY = 'array',
  JSON = 'json',
}
