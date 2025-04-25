use sqlx::SqlitePool;
use tauri::{command, AppHandle, Manager};

use crate::{
    database::{entities::endpoint_entity::Endpoint, repositories::EndpointRepository},
    models::{
        common::pagination::PaginatedResponse,
        endpoint_model::{CreateEndpointDto, EndpointFilter, UpdateEndpointDto},
    },
};

#[command]
pub async fn get_all_endpoints(
    app_handle: AppHandle,
    filter: EndpointFilter,
) -> Result<PaginatedResponse<Endpoint>, String> {
    let pool = app_handle.state::<SqlitePool>();
    EndpointRepository::find_all(&pool, &filter)
        .await
        .map_err(|e| e.to_string())
}

#[command]
pub async fn get_endpoint_by_id(
    app_handle: AppHandle,
    id: String,
) -> Result<Option<Endpoint>, String> {
    let pool = app_handle.state::<SqlitePool>();
    EndpointRepository::find_by_id(&pool, &id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_endpoint(
    app_handle: AppHandle,
    dto: CreateEndpointDto,
) -> Result<Endpoint, String> {
    let pool = app_handle.state::<SqlitePool>();
    EndpointRepository::create(&pool, dto)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_endpoint(
    app_handle: AppHandle,
    dto: UpdateEndpointDto,
) -> Result<Endpoint, String> {
    let pool = app_handle.state::<SqlitePool>();
    EndpointRepository::update(&pool, dto)
        .await
        .map_err(|e| e.to_string())
}
