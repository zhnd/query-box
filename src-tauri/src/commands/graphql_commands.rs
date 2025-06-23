use crate::common::proxy_http::{proxy_http, HttpError, HttpRequest, HttpResponse};
use serde_json::Value;
use std::collections::HashMap;
use tauri::command;
use typeshare::typeshare;

#[derive(serde::Serialize)]
struct GraphQLRequestBody {
    query: String,
    variables: Option<Value>,
    operation_name: Option<String>,
}

#[derive(serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
#[typeshare]
pub struct SendGraphQLRequestPayload {
    /// The GraphQL endpoint URL
    pub endpoint: String,
    /// Optional headers to include in the request
    pub headers: Option<HashMap<String, String>>,
    /// HTTP method to use for the request (GET or POST)
    pub method: Option<String>,
    /// The GraphQL query string
    pub query: String,
    /// Optional JSON string of variables for the GraphQL query
    pub variables: Option<String>,
}

#[command]
pub async fn send_graphql_request(
    data: SendGraphQLRequestPayload,
) -> Result<HttpResponse, HttpError> {
    // Helper function to parse variables JSON string.
    let parse_variables = |variables: Option<String>| -> Result<Option<Value>, String> {
        variables
            .filter(|v| !v.trim().is_empty())
            .map(|v| serde_json::from_str(&v).map_err(|e| e.to_string()))
            .transpose()
    };

    // Parse variables and construct the request body.
    let variables_json = parse_variables(data.variables).map_err(|e| HttpError {
        message: format!("Failed to parse variables: {}", e),
    })?;
    let request_body = GraphQLRequestBody {
        query: data.query,
        variables: variables_json,
        operation_name: None,
    };

    // Determine HTTP method and prepare headers.
    let method = data.method.as_deref().unwrap_or("POST").to_uppercase();
    let mut headers = data.headers.unwrap_or_default();
    headers.extend([
        ("Content-Type".to_string(), "application/json".to_string()),
        ("Accept".to_string(), "application/json".to_string()),
        (
            "User-Agent".to_string(),
            "Query box GraphQL Client".to_string(),
        ),
    ]);

    // Construct the HttpRequest for proxy_http.
    let http_request = HttpRequest {
        method: method.clone(),
        url: data.endpoint,
        headers: Some(headers),
        body: if method == "POST" {
            Some(serde_json::to_string(&request_body).map_err(|e| HttpError {
                message: format!("Failed to serialize GraphQL request body: {}", e),
            })?)
        } else {
            None
        },
    };

    // Call proxy_http and handle the response.
    proxy_http(http_request).await
}
