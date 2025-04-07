use sqlx::SqlitePool;
use tauri::{command, AppHandle, Manager};

use crate::database::{
    entities::request_history_entity::RequestHistory, repositories::RequestHistoryRepository,
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
