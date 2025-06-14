use reqwest::Method;
use serde_json::Value;
use std::collections::HashMap;
use std::time::Instant;
use tauri::command;
use typeshare::typeshare;

use crate::common::http_client::HTTP_CLIENT;

#[derive(serde::Serialize)]
struct GraphQLRequestBody {
    query: String,
    variables: Option<Value>,
    operation_name: Option<String>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
#[typeshare]
pub struct GraphQLResponse {
    /// The response body as a string
    body: String,
    /// HTTP response headers
    headers: HashMap<String, String>,
    /// Request duration in milliseconds
    duration_ms: u128,
    /// HTTP status code
    status_code: u16,
}

#[command]
pub async fn send_graphql_request(
    endpoint: String,
    headers: Option<HashMap<String, String>>,
    method: Option<String>,
    query: String,
    variables: Option<String>,
) -> Result<GraphQLResponse, String> {
    // Parse the variables string into a JSON Value, if provided and non-empty.
    // Filter out empty or whitespace-only strings, then attempt JSON parsing.
    // Errors are propagated as strings using the `?` operator.
    let variables_json = variables
        .filter(|v| !v.trim().is_empty())
        .map(|v| serde_json::from_str(&v))
        .transpose()
        .map_err(|e| e.to_string())?;

    // Construct the GraphQL request body with the query and parsed variables.
    // The operation_name is set to None as it's not used in this implementation.
    let request_body = GraphQLRequestBody {
        query,
        variables: variables_json,
        operation_name: None,
    };

    // Determine the HTTP method, defaulting to "POST" if not specified.
    // Convert to uppercase to make it case-insensitive (e.g., "post" -> "POST").
    // Return an error for unsupported methods.
    let method = match method.as_deref().unwrap_or("POST").to_uppercase().as_str() {
        "GET" => Method::GET,
        "POST" => Method::POST,
        m => return Err(format!("Unsupported method: {}", m)),
    };

    // "Content-Type" and "Accept" are set to "application/json" for GraphQL compatibility.
    let client = &*HTTP_CLIENT;
    let mut request = client
        .request(method.clone(), endpoint)
        .header("Content-Type", "application/json")
        .header("Accept", "application/json");

    // Apply custom headers if provided, iterating over the HashMap.
    if let Some(headers) = headers {
        for (key, value) in headers {
            request = request.header(&key, value);
        }
    }

    // Send the request based on the HTTP method.
    // - For GET: Attach query and variables as URL parameters.
    // - For POST: Send the request body as JSON.
    // Errors are mapped to strings for consistent error handling.
    let start_time = Instant::now();

    let response = match method {
        Method::GET => {
            // Prepare query parameters for GET request.
            // Variables are converted to a string, defaulting to empty if None.
            let query_params = vec![
                ("query", request_body.query),
                (
                    "variables",
                    request_body
                        .variables
                        .map_or(String::new(), |v| v.to_string()),
                ),
            ];
            request.query(&query_params).send().await
        }
        Method::POST => request.json(&request_body).send().await,
        _ => unreachable!("Method already validated above"),
    }
    .map_err(|e| e.to_string())?;

    let duration_ms = start_time.elapsed().as_millis();
    let status_code = response.status().as_u16();

    // Extract response headers
    let mut response_headers = HashMap::new();
    for (name, value) in response.headers() {
        if let Ok(value_str) = value.to_str() {
            response_headers.insert(name.to_string(), value_str.to_string());
        }
    }

    // Extract the response text, propagating any errors as strings.
    let body = response.text().await.map_err(|e| e.to_string())?;

    Ok(GraphQLResponse {
        body,
        headers: response_headers,
        duration_ms,
        status_code,
    })
}
