use serde::{Deserialize, Serialize};
use sqlx::{types::Json, FromRow};
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
    pub config: Option<EndpointConfig>,
    /// Custom HTTP headers to include in all requests
    pub headers: Option<Json<serde_json::Value>>,
    /// Whether the endpoint is marked as favorite
    pub favorite: bool,
    /// Optional tags for categorizing and filtering endpoints
    pub tags: Option<Vec<String>>,
    /// Timestamp when the endpoint was created
    pub created_at: String,
    /// Timestamp when the endpoint was last modified
    pub updated_at: String,
}

/// Database row representation of an endpoint
#[derive(Debug, FromRow)]
pub struct EndpointRow {
    id: String,
    name: String,
    description: Option<String>,
    endpoint_type: String,
    url: String,
    status: String,
    auth: Option<String>,
    config: String,
    headers: Option<String>,
    favorite: bool,
    tags: Option<String>,
    created_at: String,
    updated_at: String,
}

impl TryFrom<EndpointRow> for Endpoint {
    type Error = Box<dyn std::error::Error>;
    fn try_from(row: EndpointRow) -> Result<Self, Self::Error> {
        let id = Uuid::parse_str(&row.id)?;

        let endpoint_type = match row.endpoint_type.to_lowercase().as_str() {
            "graphql" => EndpointType::GraphQL,
            _ => return Err("unknown endpoint type".into()),
        };

        let status = match row.status.to_lowercase().as_str() {
            "active" => EndpointStatus::Active,
            "inactive" => EndpointStatus::Inactive,
            "error" => EndpointStatus::Error,
            _ => EndpointStatus::Inactive,
        };

        let auth: Option<AuthConfig> = if let Some(json) = row.auth {
            Some(serde_json::from_str(&json)?)
        } else {
            None
        };

        let config: Option<EndpointConfig> = if row.config.trim().is_empty() {
            None
        } else {
            match serde_json::from_str(&row.config) {
                Ok(config) => Some(config),
                Err(e) => {
                    println!("parse endpoint config error: {}", e);
                    Some(EndpointConfig {
                        graphql: Some(GraphQLConfig {
                            introspection_enabled: true,
                            schema_cache: None,
                            default_headers: None,
                            subscription_url: None,
                        }),
                    })
                }
            }
        };

        let headers = if let Some(json) = row.headers {
            Some(sqlx::types::Json(serde_json::from_str(&json)?))
        } else {
            None
        };

        let tags = if let Some(tags_str) = row.tags {
            Some(serde_json::from_str(&tags_str)?)
        } else {
            None
        };

        Ok(Endpoint {
            id,
            name: row.name,
            description: row.description,
            endpoint_type,
            url: row.url,
            status,
            auth,
            config,
            headers,
            favorite: row.favorite,
            tags,
            created_at: row.created_at,
            updated_at: row.updated_at,
        })
    }
}
