use serde::{Deserialize, Serialize};
use sqlx::types::Json;
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
