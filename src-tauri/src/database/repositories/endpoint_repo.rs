use crate::database::entities::endpoint_entity::{Endpoint, EndpointRow};
use crate::models::common::pagination::{PaginatedResponse, PaginationParams};
use crate::models::endpoint_model::{
    CreateEndpointDto, DeleteEndpointDto, EndpointFilter, UpdateEndpointDto,
};
use sqlx::{QueryBuilder, Row, Sqlite, SqlitePool};
use uuid::Uuid;

pub struct EndpointRepository;

impl EndpointRepository {
    pub async fn find_all(
        pool: &SqlitePool,
        filter: &EndpointFilter,
    ) -> Result<PaginatedResponse<Endpoint>, sqlx::Error> {
        let (conditions, params) = Self::build_filter_conditions(filter);

        let endpoints =
            Self::execute_main_query(pool, &conditions, &params, &filter.pagination).await?;

        let total: u32 = Self::execute_count_query(pool, &conditions, &params).await?;

        Ok(PaginatedResponse::new(endpoints, total, &filter.pagination))
    }

    fn build_filter_conditions(filter: &EndpointFilter) -> (Vec<String>, Vec<String>) {
        let mut conditions = Vec::new();
        let mut params = Vec::new();

        if let Some(name) = &filter.name {
            conditions.push("name LIKE ?".to_string());
            params.push(format!("%{}%", name));
        }

        if let Some(url) = &filter.url {
            conditions.push("url LIKE ?".to_string());
            params.push(format!("%{}%", url));
        }

        (conditions, params)
    }

    async fn execute_main_query(
        pool: &SqlitePool,
        conditions: &[String],
        params: &[String],
        pagination: &PaginationParams,
    ) -> Result<Vec<Endpoint>, sqlx::Error> {
        let mut sql = String::from("SELECT * FROM endpoint");

        if !conditions.is_empty() {
            sql.push_str(" WHERE ");
            sql.push_str(&conditions.join(" AND "));
        }

        sql.push_str(" ORDER BY name LIMIT ? OFFSET ?");

        let mut query = sqlx::query_as::<_, EndpointRow>(&sql);

        for param in params {
            query = query.bind(param);
        }

        query = query.bind(pagination.per_page()).bind(pagination.offset());

        let endpoint_rows = query.fetch_all(pool).await?;

        Ok(endpoint_rows
            .into_iter()
            .filter_map(|row| {
                Endpoint::try_from(row)
                    .map_err(|e| println!("Conversion error: {}", e))
                    .ok()
            })
            .collect())
    }

    async fn execute_count_query(
        pool: &SqlitePool,
        conditions: &[String],
        params: &[String],
    ) -> Result<u32, sqlx::Error> {
        let mut sql = String::from("SELECT COUNT(*) FROM endpoint");

        if !conditions.is_empty() {
            sql.push_str(" WHERE ");
            sql.push_str(&conditions.join(" AND "));
        }

        let mut query = sqlx::query(&sql);

        for param in params {
            query = query.bind(param);
        }

        let row = query.fetch_one(pool).await?;
        let total: u32 = row.get(0);

        Ok(total)
    }
    pub async fn find_by_id(pool: &SqlitePool, id: &str) -> Result<Option<Endpoint>, sqlx::Error> {
        let endpoint_row = sqlx::query_as::<_, EndpointRow>("SELECT * FROM endpoint WHERE id = ?")
            .bind(id)
            .fetch_optional(pool)
            .await?;

        match endpoint_row {
            Some(row) => match Endpoint::try_from(row) {
                Ok(endpoint) => Ok(Some(endpoint)),
                Err(e) => {
                    eprintln!("Error converting endpoint row: {}", e);
                    Err(sqlx::Error::RowNotFound)
                }
            },
            None => Ok(None),
        }
    }
    pub async fn create(
        pool: &SqlitePool,
        dto: CreateEndpointDto,
    ) -> Result<Endpoint, sqlx::Error> {
        let id = Uuid::new_v4().to_string();
        let config_str = dto.config_str();
        let headers_str = dto.headers_str();
        let auth_str = dto.auth_str();
        let endpoint_type_str = dto.endpoint_type_str();
        let status_str = dto.status_str();
        sqlx::query!(
            r#"
            INSERT INTO endpoint (
                id,
                name,
                description,
                endpoint_type,
                url,
                auth,
                status,
                config,
                headers,
                favorite
            )
            VALUES (
                ?,  -- id
                ?,  -- name
                ?,  -- description
                ?,  -- endpoint_type
                ?,  -- url
                ?,  -- auth
                ?,  -- status
                ?,  -- config
                ?,  -- headers
                ?   -- favorite
            )
            "#,
            id,
            dto.name,
            dto.description,
            endpoint_type_str,
            dto.url,
            auth_str,
            status_str,
            config_str,
            headers_str,
            dto.favorite,
        )
        .execute(pool)
        .await?;

        let endpoint_row = sqlx::query_as::<_, EndpointRow>("SELECT * FROM endpoint WHERE id = ?")
            .bind(&id)
            .fetch_one(pool)
            .await?;

        match Endpoint::try_from(endpoint_row) {
            Ok(endpoint) => Ok(endpoint),
            Err(e) => {
                eprintln!("Error converting endpoint row: {}", e);
                Err(sqlx::Error::RowNotFound)
            }
        }
    }

    pub async fn update(
        pool: &SqlitePool,
        dto: UpdateEndpointDto,
    ) -> Result<Endpoint, anyhow::Error> {
        let mut tx = pool.begin().await?;
        let mut builder: QueryBuilder<Sqlite> = QueryBuilder::new(
            r#"
            UPDATE endpoint SET
            "#,
        );

        let mut separated = builder.separated(", ");
        let mut update_field_count = 0;

        let fields: [(&str, Option<String>); 7] = [
            ("name", dto.name.clone()),
            ("description", dto.description.clone()),
            ("url", dto.url.clone()),
            ("status", dto.status.as_ref().map(|_| dto.status_str())),
            ("auth", dto.auth.as_ref().and_then(|_| dto.auth_str())),
            ("config", dto.config.as_ref().and_then(|_| dto.config_str())),
            (
                "headers",
                dto.headers.as_ref().and_then(|_| dto.headers_str()),
            ),
        ];

        for (col, val) in fields.iter() {
            if let Some(v) = val {
                separated.push(format!("{col} = ")).push_bind_unseparated(v);
                update_field_count += 1;
            }
        }

        if update_field_count == 0 {
            return Err(anyhow::anyhow!("No fields to update"));
        }

        separated
            .push_unseparated(" WHERE id = ")
            .push_bind_unseparated(&dto.id);

        let query = builder.build();
        query.execute(&mut *tx).await?;

        let endpoint_row = sqlx::query_as::<_, EndpointRow>("SELECT * FROM endpoint WHERE id = ?")
            .bind(&dto.id)
            .fetch_one(&mut *tx)
            .await?;

        tx.commit().await?;

        match Endpoint::try_from(endpoint_row) {
            Ok(endpoint) => Ok(endpoint),
            Err(e) => {
                anyhow::bail!(e.to_string());
            }
        }
    }

    pub async fn delete(pool: &SqlitePool, dto: DeleteEndpointDto) -> Result<(), anyhow::Error> {
        sqlx::query!("DELETE FROM endpoint WHERE id = ?", dto.id)
            .execute(pool)
            .await?;
        Ok(())
    }
}
