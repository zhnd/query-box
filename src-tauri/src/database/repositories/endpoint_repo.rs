use sqlx::{Row, SqlitePool};

use crate::database::entities::endpoint_entity::{Endpoint, EndpointRow};
use crate::models::common::pagination::{PaginatedResponse, PaginationParams};
use crate::models::endpoint_model::EndpointFilter;

pub struct EndpointRepository;

impl EndpointRepository {
    pub async fn find_all(
        pool: &SqlitePool,
        filter: &EndpointFilter,
    ) -> Result<PaginatedResponse<Endpoint>, sqlx::Error> {
        // 构建查询条件
        let (conditions, params) = Self::build_filter_conditions(filter);

        // 执行主查询获取数据
        let endpoints =
            Self::execute_main_query(pool, &conditions, &params, &filter.pagination).await?;

        println!("endpoints: {:?}", endpoints);

        // 执行 COUNT 查询获取总数
        let total: u32 = Self::execute_count_query(pool, &conditions, &params).await?;

        // 返回分页响应
        Ok(PaginatedResponse::new(endpoints, total, &filter.pagination))
    }

    // 构建过滤条件
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

    // 执行主查询获取记录
    async fn execute_main_query(
        pool: &SqlitePool,
        conditions: &[String],
        params: &[String],
        pagination: &PaginationParams,
    ) -> Result<Vec<Endpoint>, sqlx::Error> {
        // 构建基础查询
        let mut sql = String::from("SELECT * FROM endpoint");

        // 添加 WHERE 子句
        if !conditions.is_empty() {
            sql.push_str(" WHERE ");
            sql.push_str(&conditions.join(" AND "));
        }

        // 添加排序和分页
        sql.push_str(" ORDER BY name LIMIT ? OFFSET ?");

        // 构建查询
        let mut query = sqlx::query_as::<_, EndpointRow>(&sql);

        // 绑定过滤条件参数
        for param in params {
            query = query.bind(param);
        }

        // 绑定分页参数
        query = query.bind(pagination.per_page()).bind(pagination.offset());

        // 执行查询并转换结果
        let endpoint_rows = query.fetch_all(pool).await?;

        println!("endpoint_rows: {:?}", endpoint_rows);

        // 转换为 Endpoint 对象
        Ok(endpoint_rows
            .into_iter()
            .map(|row| {
                match Endpoint::try_from(row) {
                    Ok(endpoint) => endpoint,
                    Err(e) => {
                        println!("Conversion error: {}", e);
                        // 返回一个占位值，以便查看哪些行有问题
                        panic!("Conversion failed");
                    }
                }
            })
            .collect())
    }

    // 执行 COUNT 查询获取总记录数
    async fn execute_count_query(
        pool: &SqlitePool,
        conditions: &[String],
        params: &[String],
    ) -> Result<u32, sqlx::Error> {
        // 构建 COUNT 查询
        let mut sql = String::from("SELECT COUNT(*) FROM endpoint");

        // 添加 WHERE 子句
        if !conditions.is_empty() {
            sql.push_str(" WHERE ");
            sql.push_str(&conditions.join(" AND "));
        }

        // 构建查询
        let mut query = sqlx::query(&sql);

        // 绑定过滤条件参数
        for param in params {
            query = query.bind(param);
        }

        // 执行查询并获取结果
        let row = query.fetch_one(pool).await?;
        let total: u32 = row.get(0);

        Ok(total)
    }
}
