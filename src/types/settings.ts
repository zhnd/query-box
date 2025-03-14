export type UIThemeMode = 'dark' | 'light' | 'system'
export type UIResolvedUIThemeMode = 'dark' | 'light'

export enum SettingsCategories {
  UI_THEME = 'ui_theme',
}

export enum SettingsValueTypes {
  STRING = 'string',
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  ARRAY = 'array',
  JSON = 'json',
}
