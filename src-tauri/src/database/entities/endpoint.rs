use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::types::Json;
use typeshare::typeshare;
use uuid::Uuid;

/// Type of API endpoint
#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum EndpointType {
    /// GraphQL API endpoint
    GraphQL,
}

/// Status of an endpoint connection
#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum EndpointStatus {
    /// Endpoint is connected and working
    Active,
    /// Endpoint is disabled or not in use
    Inactive,
    /// Endpoint has connection or validation errors
    Error,
}

/// Authentication method for the endpoint
#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum AuthType {
    /// No authentication required
    None,
    /// Username and password authentication
    Basic,
    /// Token-based authentication using Bearer scheme
    Bearer,
    /// Authentication using API key
    ApiKey,
    /// OAuth 2.0 authentication flow
    OAuth2,
    /// Custom authentication method
    Custom,
}

/// Authentication configuration for an endpoint
#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuthConfig {
    /// Type of authentication to use
    pub auth_type: AuthType,
    /// Username for Basic auth or OAuth flows
    pub username: Option<String>,
    /// Password for Basic auth
    pub password: Option<String>,
    /// Token value for Bearer auth
    pub token: Option<String>,
    /// Name of the API key parameter
    pub api_key_name: Option<String>,
    /// Value of the API key
    pub api_key_value: Option<String>,
    /// Location to place the API key (header, query, cookie)
    pub api_key_in: Option<String>,
    /// Token endpoint URL for OAuth2 flow
    pub oauth_token_url: Option<String>,
    /// Client ID for OAuth2 flow
    pub oauth_client_id: Option<String>,
    /// Client secret for OAuth2 flow
    pub oauth_client_secret: Option<String>,
    /// Additional custom headers for authentication
    pub custom_headers: Option<Json<serde_json::Value>>,
    /// Custom function to dynamically generate auth token
    /// Expected to return a Promise that resolves to a string token value
    /// Function signature: async () => string
    pub token_script: Option<String>,
}

/// GraphQL-specific configuration
#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GraphQLConfig {
    /// Whether schema introspection is enabled for this endpoint
    pub introspection_enabled: bool,
    /// Cached schema from previous introspection query
    pub schema_cache: Option<String>,
    /// Default headers to include in GraphQL requests
    pub default_headers: Option<Json<serde_json::Value>>,
    /// WebSocket URL for GraphQL subscriptions
    pub subscription_url: Option<String>,
}

/// Combined configuration for all endpoint types
#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EndpointConfig {
    /// GraphQL-specific configuration, present when endpoint_type is GraphQL
    pub graphql: Option<GraphQLConfig>,
}

/// Main endpoint entity representing a remote API endpoint
#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Endpoint {
    /// Unique identifier of the endpoint
    pub id: Uuid,
    /// Display name of the endpoint
    pub name: String,
    /// Optional description providing additional information
    pub description: Option<String>,
    /// Type of the API endpoint (GraphQL, REST, etc.)
    pub endpoint_type: EndpointType,
    /// The URL where the endpoint can be accessed
    pub url: String,
    /// Current status of the endpoint connection
    pub status: EndpointStatus,
    /// Authentication configuration, if required
    pub auth: Option<AuthConfig>,
    /// Type-specific configuration options
    pub config: EndpointConfig,
    /// Custom HTTP headers to include in all requests
    pub headers: Option<Json<serde_json::Value>>,
    /// Whether the endpoint is marked as favorite
    pub favorite: bool,
    /// Optional tags for categorizing and filtering endpoints
    pub tags: Option<Vec<String>>,
    /// Timestamp when the endpoint was created
    pub created_at: DateTime<Utc>,
    /// Timestamp when the endpoint was last modified
    pub updated_at: DateTime<Utc>,
}

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
