use serde::{Deserialize, Serialize};
use typeshare::typeshare;

use crate::models::common::pagination::PaginationParams;

#[typeshare]
#[derive(Debug, Serialize, Deserialize)]
pub struct CustomFunctionFilter {
    pub pagination: PaginationParams,
    pub name: Option<String>,
}
