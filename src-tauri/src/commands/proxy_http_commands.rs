use crate::common::proxy_http::{proxy_http, HttpError, HttpRequest, HttpResponse};
use tauri::command;

#[command]
pub async fn proxy_http_request(request: HttpRequest) -> Result<HttpResponse, HttpError> {
    proxy_http(request).await
}
