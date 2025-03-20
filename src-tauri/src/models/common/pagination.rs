use serde::{Deserialize, Serialize};
use typeshare::typeshare;

/// Pagination parameters
#[typeshare]
#[derive(Debug, Serialize, Deserialize)]
pub struct PaginationParams {
    /// current page, default is 1
    pub page: Option<u32>,
    /// records per page, default is 20, max is 100
    pub per_page: Option<u32>,
}

impl PaginationParams {
    /// get current page, default is 1
    pub fn page(&self) -> u32 {
        self.page.unwrap_or(1).max(1)
    }

    /// get records per page, default is 20, max is 100
    pub fn per_page(&self) -> u32 {
        self.per_page.unwrap_or(20).min(100).max(1)
    }

    /// calculate SQL OFFSET
    pub fn offset(&self) -> u32 {
        (self.page() - 1) * self.per_page()
    }
}

/// Paginated response
#[typeshare]
#[derive(Debug, Serialize)]
pub struct PaginatedResponse<T> {
    /// records for the current page
    pub items: Vec<T>,
    /// total number of records
    #[typeshare(type = "number")]
    pub total: u32,
    /// current page number
    pub page: u32,
    /// records per page
    pub per_page: u32,
    /// total number of pages
    pub total_pages: u32,
}

impl<T> PaginatedResponse<T> {
    /// create a new paginated response
    pub fn new(items: Vec<T>, total: u32, params: &PaginationParams) -> Self {
        let page = params.page();
        let per_page = params.per_page();
        let total_pages = total.div_ceil(per_page);

        Self {
            items,
            total,
            page,
            per_page,
            total_pages,
        }
    }
}
