use sqlx::SqlitePool;
use tauri::{command, AppHandle, Manager};

use crate::{
    database::{
        entities::request_history_entity::RequestHistory, repositories::RequestHistoryRepository,
    },
    models::request_history_model::{CreateRequestHistoryDto, UpdateRequestHistoryDto},
};

#[command]
pub async fn get_all_request_histories(
    app_handle: AppHandle,
    endpoint_id: String,
) -> Result<Vec<RequestHistory>, String> {
    let pool = app_handle.state::<SqlitePool>();
    RequestHistoryRepository::find_all(&pool, endpoint_id)
        .await
        .map_err(|e| e.to_string())
}

#[command]
pub async fn create_request_history(
    app_handle: AppHandle,
    dto: CreateRequestHistoryDto,
) -> Result<RequestHistory, String> {
    let pool = app_handle.state::<SqlitePool>();
    RequestHistoryRepository::create(&pool, dto)
        .await
        .map_err(|e| e.to_string())
}

#[command]
pub async fn update_request_history(
    app_handle: AppHandle,
    dto: UpdateRequestHistoryDto,
) -> Result<RequestHistory, String> {
    let pool = app_handle.state::<SqlitePool>();
    RequestHistoryRepository::update(&pool, dto)
        .await
        .map_err(|e| e.to_string())
}

#[command]
pub async fn delete_request_history(app_handle: AppHandle, id: String) -> Result<(), String> {
    let pool = app_handle.state::<SqlitePool>();
    RequestHistoryRepository::delete(&pool, id)
        .await
        .map_err(|e| e.to_string())
}
