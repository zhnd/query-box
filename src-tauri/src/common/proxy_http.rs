use reqwest::Method;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::time::Instant;
use typeshare::typeshare;

use crate::common::http_client::HTTP_CLIENT;

#[derive(Deserialize)]
#[typeshare]
pub struct HttpRequest {
    pub method: String,
    pub url: String,
    pub headers: Option<HashMap<String, String>>,
    pub body: Option<String>,
}

#[derive(Serialize)]
#[typeshare]
pub struct HttpResponse {
    pub status_code: u16,
    pub headers: HashMap<String, String>,
    pub body: String,
    pub duration_ms: u128,
}

#[derive(Serialize)]
#[typeshare]
pub struct HttpError {
    pub message: String,
}

pub async fn proxy_http(request: HttpRequest) -> Result<HttpResponse, HttpError> {
    let method = request.method.parse::<Method>().map_err(|e| HttpError {
        message: format!("Invalid HTTP method: {}", e),
    })?;
    let mut req_builder = HTTP_CLIENT.request(method, &request.url);

    if let Some(headers) = &request.headers {
        for (key, value) in headers {
            req_builder = req_builder.header(key, value);
        }
    }
    if let Some(body) = &request.body {
        req_builder = req_builder.body(body.clone());
    }

    let start_time = Instant::now(); // Start timing
    let response = req_builder.send().await;
    let duration_ms = start_time.elapsed().as_millis(); // Calculate duration

    match response {
        Ok(resp) => {
            let status_code = resp.status().as_u16();
            let headers = resp
                .headers()
                .iter()
                .map(|(k, v)| {
                    Ok((
                        k.to_string(),
                        v.to_str()
                            .map_err(|e| HttpError {
                                message: format!("Header decode error: {}", e),
                            })?
                            .to_string(),
                    ))
                })
                .collect::<Result<HashMap<String, String>, HttpError>>()?;
            let body = resp.text().await.map_err(|e| HttpError {
                message: format!("Failed to read response body: {}", e),
            })?;
            Ok(HttpResponse {
                status_code,
                headers,
                body,
                duration_ms,
            })
        }
        Err(err) => Err(HttpError {
            message: format!("HTTP request failed: {}", err),
        }),
    }
}
