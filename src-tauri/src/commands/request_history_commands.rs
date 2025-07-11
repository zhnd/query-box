use sqlx::SqlitePool;
use tauri::{command, AppHandle, Manager};

use crate::{
    database::{
        entities::request_history_entity::RequestHistory, repositories::RequestHistoryRepository,
    },
    models::request_history_model::{
        CreateRequestHistoryDto, DeleteRequestHistoryDto, RequestHistoryFilter,
        SetActiveRequestHistoryDto, UpdateRequestHistoryDto,
    },
};

#[command]
pub async fn get_all_request_histories(
    app_handle: AppHandle,
    filter: RequestHistoryFilter,
) -> Result<Vec<RequestHistory>, String> {
    let pool = app_handle.state::<SqlitePool>();
    RequestHistoryRepository::find_all(&pool, filter)
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
pub async fn delete_request_history(
    app_handle: AppHandle,
    dto: DeleteRequestHistoryDto,
) -> Result<(), String> {
    let pool = app_handle.state::<SqlitePool>();
    RequestHistoryRepository::delete(&pool, dto)
        .await
        .map_err(|e| e.to_string())
}

#[command]
pub async fn set_active_request_history(
    app_handle: AppHandle,
    dto: SetActiveRequestHistoryDto,
) -> Result<(), String> {
    let pool = app_handle.state::<SqlitePool>();
    RequestHistoryRepository::set_active(&pool, dto)
        .await
        .map_err(|e| e.to_string())
}
