use sqlx::{QueryBuilder, Sqlite, SqlitePool};
use uuid::Uuid;

use crate::{
    database::entities::request_history_entity::{RequestHistory, RequestHistoryRow},
    models::request_history_model::{
        CreateRequestHistoryDto, DeleteRequestHistoryDto, RequestHistoryFilter,
        UpdateRequestHistoryDto,
    },
};

pub struct RequestHistoryRepository;

impl RequestHistoryRepository {
    pub async fn find_all(
        pool: &SqlitePool,
        filter: RequestHistoryFilter,
    ) -> Result<Vec<RequestHistory>, anyhow::Error> {
        let rows: Vec<RequestHistoryRow> = sqlx::query_as::<_, RequestHistoryRow>(
            r#"
            SELECT * FROM request_history WHERE endpoint_id = ? ORDER BY created_at DESC
            "#,
        )
        .bind(filter.endpoint_id)
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
        let mut builder: QueryBuilder<Sqlite> = QueryBuilder::new(
            r#"
            UPDATE request_history SET
            "#,
        );

        let mut separated = builder.separated(", ");
        let mut update_field_count = 0;

        if let Some(name) = &dto.name {
            separated.push("name = ").push_bind_unseparated(name);
            update_field_count += 1;
        }

        if let Some(method) = &dto.method {
            separated
                .push("method = ")
                .push_bind_unseparated(method.to_string());
            update_field_count += 1;
        }

        if let Some(headers) = &dto.headers {
            separated.push("headers = ").push_bind_unseparated(headers);
            update_field_count += 1;
        }

        if let Some(body) = &dto.body {
            separated.push("body = ").push_bind_unseparated(body);
            update_field_count += 1;
        }

        if let Some(query) = &dto.query {
            separated.push("query = ").push_bind_unseparated(query);
            update_field_count += 1;
        }

        if update_field_count == 0 {
            return Err(anyhow::Error::msg("No fields to update"));
        }

        builder.push(" WHERE id = ");
        builder.push_bind(&dto.id);

        let query = builder.build();
        query.execute(&mut *tx).await?;

        let request_history_row = sqlx::query_as::<_, RequestHistoryRow>(
            r#"
                SELECT * FROM request_history WHERE id = ?
                "#,
        )
        .bind(&dto.id)
        .fetch_one(&mut *tx) // Changed from pool to &mut *tx
        .await?;

        tx.commit().await?;

        RequestHistory::try_from(request_history_row).map_err(|e| anyhow::Error::msg(e.to_string()))
    }

    pub async fn delete(
        pool: &SqlitePool,
        dto: DeleteRequestHistoryDto,
    ) -> Result<(), anyhow::Error> {
        if dto.id.is_none() && dto.endpoint_id.is_none() {
            return Err(anyhow::Error::msg(
                "Either id or endpoint_id must be provided",
            ));
        }

        let mut builder: QueryBuilder<Sqlite> = QueryBuilder::new(
            r#"
            DELETE FROM request_history WHERE
            "#,
        );
        let mut separated = builder.separated(" AND ");

        if let Some(id) = dto.id {
            separated.push("id = ").push_bind_unseparated(id);
        }

        if let Some(endpoint_id) = dto.endpoint_id {
            separated
                .push("endpoint_id = ")
                .push_bind_unseparated(endpoint_id);
        }

        let query = builder.build();
        let result = query.execute(pool).await?;

        if result.rows_affected() == 0 {
            return Err(anyhow::Error::msg("No record found matching the criteria"));
        }

        Ok(())
    }
}
