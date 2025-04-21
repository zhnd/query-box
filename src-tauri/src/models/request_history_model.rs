use serde::{Deserialize, Serialize};
use sqlx::types::Json;
use typeshare::typeshare;

use crate::common::http_method::HttpMethod;

#[typeshare]
#[derive(Debug, Serialize, Deserialize)]
pub struct CreateRequestHistoryDto {
    /// Identifier for the associated endpoint
    pub endpoint_id: String,
    /// Name of the request
    pub name: Option<String>,
    /// HTTP method used for the request
    pub method: HttpMethod,
    /// Headers included in the request
    pub headers: Option<Json<serde_json::Value>>,
    /// Body of the request
    pub body: Option<Json<serde_json::Value>>,
    /// Query parameters included in the request
    pub query: Option<String>,
}

#[typeshare]
#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateRequestHistoryDto {
    /// Unique identifier for the request history entry
    pub id: String,
    /// Name of the request
    pub name: Option<String>,
    /// HTTP method used for the request
    pub method: Option<HttpMethod>,
    /// Headers included in the request
    pub headers: Option<Json<serde_json::Value>>,
    /// Body of the request
    pub body: Option<Json<serde_json::Value>>,
    /// Query parameters included in the request
    pub query: Option<String>,
}

#[typeshare]
#[derive(Debug, Serialize, Deserialize)]
pub struct DeleteRequestHistoryDto {
    pub id: Option<String>,
    pub endpoint_id: Option<String>,
}

#[typeshare]
#[derive(Debug, Serialize, Deserialize)]
pub struct RequestHistoryFilter {
    pub endpoint_id: String,
}
