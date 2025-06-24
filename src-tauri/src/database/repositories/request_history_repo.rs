use log::{debug, error, info, warn};
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
        debug!(
            "Finding all request history for endpoint_id: {}",
            filter.endpoint_id
        );

        let rows: Vec<RequestHistoryRow> = sqlx::query_as::<_, RequestHistoryRow>(
            r#"
            SELECT * FROM request_history WHERE endpoint_id = ? ORDER BY created_at DESC
            "#,
        )
        .bind(&filter.endpoint_id)
        .fetch_all(pool)
        .await?;

        let histories: Vec<RequestHistory> = rows
            .into_iter()
            .filter_map(|row| {
                RequestHistory::try_from(row)
                    .map_err(|e| {
                        error!("Failed to convert request history row: {}", e);
                        e
                    })
                    .ok()
            })
            .collect();

        debug!(
            "Retrieved {} request history records for endpoint_id: {}",
            histories.len(),
            filter.endpoint_id
        );
        Ok(histories)
    }

    pub async fn create(
        pool: &SqlitePool,
        dto: CreateRequestHistoryDto,
    ) -> Result<RequestHistory, anyhow::Error> {
        let id = Uuid::new_v4().to_string();
        let method_str = dto.method.to_string();

        debug!(
            "Creating request history with id: {}, endpoint_id: {}, method: {}",
            id, dto.endpoint_id, method_str
        );

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

        debug!("Request history record inserted, fetching created record");

        let request_history_row = sqlx::query_as::<_, RequestHistoryRow>(
            r#"
                SELECT * FROM request_history WHERE id = ?
                "#,
        )
        .bind(&id)
        .fetch_one(&mut *tx)
        .await?;

        tx.commit().await?;

        match RequestHistory::try_from(request_history_row) {
            Ok(history) => {
                info!(
                    "Successfully created request history: {:?} for endpoint: {}",
                    history.name, dto.endpoint_id
                );
                Ok(history)
            }
            Err(e) => {
                error!("Failed to convert created request history row: {}", e);
                Err(anyhow::Error::msg(e.to_string()))
            }
        }
    }

    pub async fn update(
        pool: &SqlitePool,
        dto: UpdateRequestHistoryDto,
    ) -> Result<RequestHistory, anyhow::Error> {
        debug!("Updating request history with id: {}", dto.id);

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
            debug!("Updating name field");
        }

        if let Some(method) = &dto.method {
            separated
                .push("method = ")
                .push_bind_unseparated(method.to_string());
            update_field_count += 1;
            debug!("Updating method field to: {}", method);
        }

        if let Some(headers) = &dto.headers {
            separated.push("headers = ").push_bind_unseparated(headers);
            update_field_count += 1;
            debug!("Updating headers field");
        }

        if let Some(body) = &dto.body {
            separated.push("body = ").push_bind_unseparated(body);
            update_field_count += 1;
            debug!("Updating body field");
        }

        if let Some(query) = &dto.query {
            separated.push("query = ").push_bind_unseparated(query);
            update_field_count += 1;
            debug!("Updating query field");
        }

        if update_field_count == 0 {
            warn!("No fields to update for request history id: {}", dto.id);
            return Err(anyhow::Error::msg("No fields to update"));
        }

        debug!(
            "Updating {} fields for request history id: {}",
            update_field_count, dto.id
        );

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
        .fetch_one(&mut *tx)
        .await?;

        tx.commit().await?;

        match RequestHistory::try_from(request_history_row) {
            Ok(history) => {
                info!("Successfully updated request history: {:?}", history.name);
                Ok(history)
            }
            Err(e) => {
                error!("Failed to convert updated request history row: {}", e);
                Err(anyhow::Error::msg(e.to_string()))
            }
        }
    }

    pub async fn delete(
        pool: &SqlitePool,
        dto: DeleteRequestHistoryDto,
    ) -> Result<(), anyhow::Error> {
        if dto.id.is_none() && dto.endpoint_id.is_none() {
            warn!("Delete request history called without id or endpoint_id");
            return Err(anyhow::Error::msg(
                "Either id or endpoint_id must be provided",
            ));
        }

        debug!(
            "Deleting request history - id: {:?}, endpoint_id: {:?}",
            dto.id, dto.endpoint_id
        );

        let mut builder: QueryBuilder<Sqlite> = QueryBuilder::new(
            r#"
            DELETE FROM request_history WHERE
            "#,
        );
        let mut separated = builder.separated(" AND ");

        if let Some(id) = &dto.id {
            separated.push("id = ").push_bind_unseparated(id);
            debug!("Adding id condition to delete query");
        }

        if let Some(endpoint_id) = &dto.endpoint_id {
            separated
                .push("endpoint_id = ")
                .push_bind_unseparated(endpoint_id);
            debug!("Adding endpoint_id condition to delete query");
        }

        let query = builder.build();
        let result = query.execute(pool).await?;

        if result.rows_affected() == 0 {
            warn!("No request history records found matching the criteria - id: {:?}, endpoint_id: {:?}",
                  dto.id, dto.endpoint_id);
            return Err(anyhow::Error::msg("No record found matching the criteria"));
        }

        info!(
            "Successfully deleted {} request history record(s)",
            result.rows_affected()
        );
        Ok(())
    }
}
