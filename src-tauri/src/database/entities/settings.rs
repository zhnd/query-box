use serde::{Deserialize, Serialize};
use sqlx::FromRow;

/// Represents a single application setting in the key-value store pattern.
///
/// This entity maps directly to the `app_settings` table in the database,
/// where each row represents a single configuration item. The key-value pattern
/// allows for flexible storage of various configuration types without requiring
/// schema changes when new settings are added.
///
/// All fields are defined as `Option<String>` to accommodate SQLx's behavior
/// with SQLite, which treats columns as potentially nullable during compile-time
/// checking regardless of NOT NULL constraints in the schema.
///
#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Setting {
    /// Unique identifier for the setting, serving as the primary key.
    /// Examples: "ui.theme.mode", "network.timeout", "editor.font_size"
    pub key: Option<String>,

    /// The actual configuration value stored as a string.
    /// Type-specific parsing is required based on the value_type.
    pub value: Option<String>,

    /// Indicates the data type of the value: "string", "boolean", "number", "json", etc.
    /// Used for proper type conversion when retrieving settings.
    pub value_type: Option<String>,

    /// Logical grouping of settings for organizational purposes.
    /// Examples: "ui_theme", "network", "editor", "security"
    pub category: Option<String>,

    /// Optional human-readable description of the setting's purpose.
    /// Useful for self-documentation and UI display.
    pub description: Option<String>,

    pub created_at: Option<String>,
    pub updated_at: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewSetting {
    pub key: String,
    pub value: String,
    pub value_type: String,
    pub category: String,
    pub description: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateSetting {
    pub value: String,
}
