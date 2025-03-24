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
    pub config: Option<EndpointConfig>,
    /// Custom HTTP headers to include in all requests
    pub headers: Option<Json<serde_json::Value>>,
    /// Whether the endpoint is marked as favorite
    pub favorite: Option<bool>,
}

impl CreateEndpointDto {
    pub fn endpoint_type_str(&self) -> String {
        self.endpoint_type.to_string()
    }
    pub fn status_str(&self) -> String {
        // New endpoints are always active by default
        EndpointStatus::Active.to_string()
    }
    pub fn auth_str(&self) -> Option<String> {
        self.auth
            .as_ref()
            .map(|auth| serde_json::to_string(auth).unwrap_or_default())
    }
    pub fn config_str(&self) -> Option<String> {
        self.config
            .as_ref()
            .map(|config| serde_json::to_string(config).unwrap_or_default())
    }

    pub fn headers_str(&self) -> Option<String> {
        self.headers
            .as_ref()
            .map(|headers| serde_json::to_string(headers).unwrap_or_default())
    }
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
