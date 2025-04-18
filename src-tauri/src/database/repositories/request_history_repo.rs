use sqlx::SqlitePool;
use uuid::Uuid;

use crate::{
    database::entities::request_history_entity::{RequestHistory, RequestHistoryRow},
    models::request_history_model::{CreateRequestHistoryDto, UpdateRequestHistoryDto},
};

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

    pub async fn create(
        pool: &SqlitePool,
        dto: CreateRequestHistoryDto,
    ) -> Result<RequestHistory, anyhow::Error> {
        let id = Uuid::new_v4().to_string();
        let method_str = dto.method.to_string();

        let mut tx = pool.begin().await?;

        sqlx::query!(
            r#"
            INSERT INTO request_history (
                id,
                endpoint_id,
                name,
                method,
                headers,
                body,
                query
            )
            VALUES (
                ?,  -- id
                ?,  -- endpoint_id
                ?,  -- name
                ?,  -- method
                ?,  -- headers
                ?,  -- body
                ?   -- query
            )
            "#,
            id,
            dto.endpoint_id,
            dto.name,
            method_str,
            dto.headers,
            dto.body,
            dto.query,
        )
        .execute(&mut *tx)
        .await?;

        let request_history_row = sqlx::query_as::<_, RequestHistoryRow>(
            r#"
                SELECT * FROM request_history WHERE id = ?
                "#,
        )
        .bind(&id)
        .fetch_one(&mut *tx)
        .await?;

        tx.commit().await?;
        RequestHistory::try_from(request_history_row).map_err(|e| anyhow::Error::msg(e.to_string()))
    }

    pub async fn update(
        pool: &SqlitePool,
        dto: UpdateRequestHistoryDto,
    ) -> Result<RequestHistory, anyhow::Error> {
        let mut tx = pool.begin().await?;

        let method_str = dto
            .method
            .as_ref()
            .map(|m| m.to_string())
            .unwrap_or_else(|| "GET".to_string());

        sqlx::query!(
            r#"
            UPDATE request_history SET
                name = ?,
                method = ?,
                headers = ?,
                body = ?,
                query = ?
            WHERE id = ?
            "#,
            dto.name,
            method_str,
            dto.headers,
            dto.body,
            dto.query,
            dto.id,
        )
        .execute(&mut *tx)
        .await?;

        let request_history_row =
            sqlx::query_as::<_, RequestHistoryRow>(r#"SELECT * FROM request_history WHERE id = ?"#)
                .bind(&dto.id)
                .fetch_one(&mut *tx) // Changed from pool to &mut *tx
                .await?;

        tx.commit().await?;

        RequestHistory::try_from(request_history_row).map_err(|e| anyhow::Error::msg(e.to_string()))
    }
}
