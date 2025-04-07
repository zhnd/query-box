use sqlx::SqlitePool;

use crate::database::entities::request_history_entity::{RequestHistory, RequestHistoryRow};

pub struct RequestHistoryRepository;

impl RequestHistoryRepository {
    pub async fn find_all(
        pool: &SqlitePool,
        endpoint_id: String,
    ) -> Result<Vec<RequestHistory>, sqlx::Error> {
        let rows: Vec<RequestHistoryRow> = sqlx::query_as::<_, RequestHistoryRow>(
            "SELECT * FROM request_history WHERE endpoint_id = ? ORDER BY created_at DESC",
        )
        .bind(endpoint_id)
        .fetch_all(pool)
        .await?;

        Ok(rows
            .into_iter()
            .filter_map(|row| RequestHistory::try_from(row).ok())
            .collect())
    }
}
