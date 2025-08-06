use log::error;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use typeshare::typeshare;
use uuid::Uuid;

#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CustomFunction {
    pub id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub code: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, FromRow)]
pub struct CustomFunctionRow {
    id: String,
    name: String,
    description: Option<String>,
    code: String,
    created_at: String,
    updated_at: String,
}

impl TryFrom<CustomFunctionRow> for CustomFunction {
    type Error = Box<dyn std::error::Error>;

    fn try_from(row: CustomFunctionRow) -> Result<Self, Self::Error> {
        let id = Uuid::parse_str(&row.id).map_err(|e| {
            error!("Failed to parse UUID: {}", e);
            e
        })?;

        Ok(CustomFunction {
            id,
            name: row.name,
            description: row.description,
            code: row.code,
            created_at: row.created_at,
            updated_at: row.updated_at,
        })
    }
}
