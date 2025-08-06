use sqlx::{Row, SqlitePool};

use crate::database::entities::custom_function_entity::{CustomFunction, CustomFunctionRow};
use crate::models::common::pagination::PaginationParams;
use crate::models::{
    common::pagination::PaginatedResponse, custom_function_model::CustomFunctionFilter,
};
pub struct CustomFunctionRepository;

impl CustomFunctionRepository {
    pub async fn find_all(
        pool: &SqlitePool,
        filter: &CustomFunctionFilter,
    ) -> Result<PaginatedResponse<CustomFunction>, sqlx::Error> {
        let (conditions, params) = Self::build_filter_conditions(filter);

        let functions =
            Self::execute_main_query(pool, &conditions, &params, &filter.pagination).await?;

        let total: u32 = Self::execute_count_query(pool, &conditions, &params).await?;

        Ok(PaginatedResponse::new(functions, total, &filter.pagination))
    }

    fn build_filter_conditions(filter: &CustomFunctionFilter) -> (Vec<String>, Vec<String>) {
        let mut conditions = Vec::new();
        let mut params = Vec::new();

        if let Some(name) = &filter.name {
            conditions.push("name LIKE ?".to_string());
            params.push(format!("%{}%", name));
        }

        (conditions, params)
    }

    async fn execute_main_query(
        pool: &SqlitePool,
        conditions: &[String],
        params: &[String],
        pagination: &PaginationParams,
    ) -> Result<Vec<CustomFunction>, sqlx::Error> {
        let mut sql = String::from("SELECT * FROM function");

        if !conditions.is_empty() {
            sql.push_str(" WHERE ");
            sql.push_str(&conditions.join(" AND "));
        }

        sql.push_str(" ORDER BY created_at DESC");
        sql.push_str(" LIMIT ? OFFSET ?");

        let mut query = sqlx::query_as::<_, CustomFunctionRow>(&sql);

        for param in params {
            query = query.bind(param);
        }

        query = query.bind(pagination.per_page()).bind(pagination.offset());

        let function_rows = query.fetch_all(pool).await?;

        let functions: Vec<CustomFunction> = function_rows
            .into_iter()
            .filter_map(|row| match CustomFunction::try_from(row) {
                Ok(func) => Some(func),
                Err(e) => {
                    log::error!("Failed to convert FunctionRow to Function: {}", e);
                    None
                }
            })
            .collect();
        Ok(functions)
    }

    async fn execute_count_query(
        pool: &SqlitePool,
        conditions: &[String],
        params: &[String],
    ) -> Result<u32, sqlx::Error> {
        let mut sql = String::from("SELECT COUNT(*) as count FROM function");

        if !conditions.is_empty() {
            sql.push_str(" WHERE ");
            sql.push_str(&conditions.join(" AND "));
        }

        let mut query = sqlx::query(&sql);

        for param in params {
            query = query.bind(param);
        }

        let row = query.fetch_one(pool).await?;
        let total: u32 = row.get("count");

        Ok(total)
    }
}
