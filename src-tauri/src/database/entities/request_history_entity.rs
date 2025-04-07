use std::str::FromStr;

use serde::{Deserialize, Serialize};
use sqlx::{types::Json, FromRow};
use typeshare::typeshare;
use uuid::Uuid;

use crate::common::http_method::HttpMethod;

#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RequestHistory {
    /// Unique identifier for the request history entry
    pub id: Uuid,
    /// Table identifier for the request history entry
    pub tab_id: String,
    /// Identifier of the endpoint associated with this request
    pub endpoint_id: Uuid,
    /// History name
    pub name: Option<String>,
    /// HTTP method used for the request (e.g., GET, POST)
    pub method: HttpMethod,
    /// Request headers in JSON format
    pub headers: Option<Json<serde_json::Value>>,
    /// Request body in JSON format
    pub body: Option<Json<serde_json::Value>>,
    /// Request query
    pub query: Option<String>,
    /// Timestamp when the request was made
    pub created_at: String,
    /// Timestamp when the request was last updated
    pub updated_at: String,
}

#[derive(Debug, FromRow)]
pub struct RequestHistoryRow {
    pub id: String,
    pub tab_id: String,
    pub endpoint_id: String,
    pub name: Option<String>,
    pub method: String,
    pub headers: Option<String>,
    pub body: Option<String>,
    pub query: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

impl TryFrom<RequestHistoryRow> for RequestHistory {
    type Error = Box<dyn std::error::Error>;

    fn try_from(row: RequestHistoryRow) -> Result<Self, Self::Error> {
        let method =
            HttpMethod::from_str(&row.method.to_lowercase()).map_err(|_| "unknown http method")?;

        let headers = if let Some(headers) = row.headers {
            Some(sqlx::types::Json(serde_json::from_str(&headers)?))
        } else {
            None
        };

        let body = if let Some(body) = row.body {
            Some(sqlx::types::Json(serde_json::from_str(&body)?))
        } else {
            None
        };

        Ok(Self {
            id: Uuid::parse_str(&row.id)?,
            tab_id: row.tab_id,
            endpoint_id: Uuid::parse_str(&row.endpoint_id)?,
            name: row.name,
            method,
            headers,
            body,
            query: row.query,
            created_at: row.created_at,
            updated_at: row.updated_at,
        })
    }
}
