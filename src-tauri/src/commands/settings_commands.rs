use sqlx::SqlitePool;
use tauri::{command, AppHandle, Manager};

use crate::database::{
    entities::settings::{NewSetting, Setting, UpdateSetting},
    repositories::{settings_repo::UpsertOptions, SettingsRepository},
};
use std::collections::HashMap;

#[command]
pub async fn get_all_settings(app_handle: AppHandle) -> Result<Vec<Setting>, String> {
    let pool = app_handle.state::<SqlitePool>();
    SettingsRepository::find_all(&pool)
        .await
        .map_err(|e| e.to_string())
}

#[command]
pub async fn get_settings_by_category(
    app_handle: AppHandle,
    category: String,
) -> Result<Vec<Setting>, String> {
    let pool = app_handle.state::<SqlitePool>();
    SettingsRepository::find_by_category(&pool, &category)
        .await
        .map_err(|e| e.to_string())
}

#[command]
pub async fn get_settings_map(
    app_handle: AppHandle,
    category: String,
) -> Result<HashMap<String, String>, String> {
    let pool = app_handle.state::<SqlitePool>();
    SettingsRepository::get_category_map(&pool, &category)
        .await
        .map_err(|e| e.to_string())
}

#[command]
pub async fn get_setting(app_handle: AppHandle, key: String) -> Result<Option<Setting>, String> {
    let pool = app_handle.state::<SqlitePool>();
    SettingsRepository::find_by_key(&pool, &key)
        .await
        .map_err(|e| e.to_string())
}

#[command]
pub async fn update_setting(
    app_handle: AppHandle,
    key: String,
    setting: UpdateSetting,
) -> Result<bool, String> {
    let pool = app_handle.state::<SqlitePool>();
    SettingsRepository::update(&pool, &key, setting)
        .await
        .map_err(|e| e.to_string())
}

#[command]
pub async fn create_setting(app_handle: AppHandle, setting: NewSetting) -> Result<(), String> {
    let pool = app_handle.state::<SqlitePool>();
    SettingsRepository::create(&pool, setting)
        .await
        .map_err(|e| e.to_string())
}

#[command]
pub async fn delete_setting(app_handle: AppHandle, key: String) -> Result<bool, String> {
    let pool = app_handle.state::<SqlitePool>();
    SettingsRepository::delete(&pool, &key)
        .await
        .map_err(|e| e.to_string())
}

#[command]
pub async fn upsert_setting(
    app_handle: AppHandle,
    key: String,
    value: String,
    options: Option<UpsertOptions>,
) -> Result<(), String> {
    let pool = app_handle.state::<SqlitePool>();
    SettingsRepository::upsert_setting(&pool, &key, value, options)
        .await
        .map_err(|e| e.to_string())
}
