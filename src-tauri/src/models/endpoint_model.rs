use serde::{Deserialize, Serialize};
use sqlx::types::Json;
use typeshare::typeshare;

use crate::database::entities::endpoint_entity::{
    AuthConfig, EndpointConfig, EndpointStatus, EndpointType,
};
use crate::models::common::pagination::PaginationParams;

/// Data transfer object for creating a new endpoint
#[typeshare]
#[derive(Debug, Serialize, Deserialize)]
pub struct CreateEndpointDto {
    /// Display name of the endpoint
    pub name: String,
    /// Optional description providing additional information
    pub description: Option<String>,
    /// Type of the API endpoint
    pub endpoint_type: EndpointType,
    /// The URL where the endpoint can be accessed
    pub url: String,
    /// Authentication configuration, if required
    pub auth: Option<AuthConfig>,
    /// Type-specific configuration options
    pub config: EndpointConfig,
    /// Custom HTTP headers to include in all requests
    pub headers: Option<Json<serde_json::Value>>,
    /// Optional tags for categorizing and filtering endpoints
    pub tags: Option<Vec<String>>,
    /// Whether the endpoint is marked as favorite
    pub favorite: Option<bool>,
}

/// Data transfer object for updating an existing endpoint
#[typeshare]
#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateEndpointDto {
    /// Updated display name
    pub name: Option<String>,
    /// Updated description
    pub description: Option<String>,
    /// Updated endpoint URL
    pub url: Option<String>,
    /// Updated endpoint status
    pub status: Option<EndpointStatus>,
    /// Updated authentication configuration
    pub auth: Option<AuthConfig>,
    /// Updated type-specific configuration
    pub config: Option<EndpointConfig>,
    /// Updated custom HTTP headers
    pub headers: Option<Json<serde_json::Value>>,
    /// Updated tags for categorizing and filtering endpoints
    pub tags: Option<Vec<String>>,
    /// Updated favorite status
    pub favorite: Option<bool>,
}

#[typeshare]
#[derive(Debug, Serialize, Deserialize)]
pub struct EndpointFilter {
    pub pagination: PaginationParams,
    pub name: Option<String>,
    pub url: Option<String>,
}
