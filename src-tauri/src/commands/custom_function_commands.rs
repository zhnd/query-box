use sqlx::SqlitePool;
use tauri::{command, AppHandle, Manager};

use crate::{
    database::{
        entities::custom_function_entity::CustomFunction, repositories::CustomFunctionRepository,
    },
    models::{common::pagination::PaginatedResponse, custom_function_model::CustomFunctionFilter},
};

#[command]
pub async fn get_all_custom_functions(
    app_handle: AppHandle,
    filter: CustomFunctionFilter,
) -> Result<PaginatedResponse<CustomFunction>, String> {
    let pool = app_handle.state::<SqlitePool>();
    CustomFunctionRepository::find_all(&pool, &filter)
        .await
        .map_err(|e| e.to_string())
}
