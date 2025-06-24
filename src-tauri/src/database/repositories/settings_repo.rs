use crate::database::entities::settings_entity::{NewSetting, Setting, UpdateSetting};
use log::{debug, error, info, warn};
use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize)]
pub struct UpsertOptions {
    pub value_type: String,
    pub category: String,
    pub description: String,
}

pub struct SettingsRepository;

impl SettingsRepository {
    pub async fn find_all(pool: &SqlitePool) -> Result<Vec<Setting>, sqlx::Error> {
        debug!("Fetching all settings");

        let settings =
            sqlx::query_as!(Setting, "SELECT * FROM app_settings ORDER BY category, key")
                .fetch_all(pool)
                .await?;

        debug!("Retrieved {} settings", settings.len());
        Ok(settings)
    }

    pub async fn find_by_category(
        pool: &SqlitePool,
        category: &str,
    ) -> Result<Vec<Setting>, sqlx::Error> {
        debug!("Fetching settings for category: {}", category);

        let settings = sqlx::query_as!(
            Setting,
            "SELECT * FROM app_settings WHERE category = ? ORDER BY key",
            category
        )
        .fetch_all(pool)
        .await?;

        debug!(
            "Retrieved {} settings for category: {}",
            settings.len(),
            category
        );
        Ok(settings)
    }

    pub async fn find_by_key(pool: &SqlitePool, key: &str) -> Result<Option<Setting>, sqlx::Error> {
        debug!("Finding setting by key: {}", key);

        let setting = sqlx::query_as!(Setting, "SELECT * FROM app_settings WHERE key = ?", key)
            .fetch_optional(pool)
            .await?;

        match &setting {
            Some(_) => debug!("Found setting for key: {}", key),
            None => debug!("No setting found for key: {}", key),
        }

        Ok(setting)
    }

    pub async fn create(pool: &SqlitePool, setting: NewSetting) -> Result<(), sqlx::Error> {
        debug!(
            "Creating new setting: key={}, category={}",
            setting.key, setting.category
        );

        sqlx::query!(
            "INSERT INTO app_settings (key, value, value_type, category, description) VALUES (?, ?, ?, ?, ?)",
            setting.key,
            setting.value,
            setting.value_type,
            setting.category,
            setting.description
        )
        .execute(pool)
        .await?;

        info!("Successfully created setting: {}", setting.key);
        Ok(())
    }

    pub async fn update(
        pool: &SqlitePool,
        key: &str,
        setting: UpdateSetting,
    ) -> Result<bool, sqlx::Error> {
        debug!("Updating setting: key={}, value={}", key, setting.value);

        let result = sqlx::query!(
            "UPDATE app_settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?",
            setting.value,
            key
        )
        .execute(pool)
        .await?;

        let updated = result.rows_affected() > 0;
        if updated {
            info!("Successfully updated setting: {}", key);
        } else {
            warn!("No setting found to update for key: {}", key);
        }

        Ok(updated)
    }

    pub async fn delete(pool: &SqlitePool, key: &str) -> Result<bool, sqlx::Error> {
        debug!("Deleting setting: key={}", key);

        let result = sqlx::query!("DELETE FROM app_settings WHERE key = ?", key)
            .execute(pool)
            .await?;

        let deleted = result.rows_affected() > 0;
        if deleted {
            info!("Successfully deleted setting: {}", key);
        } else {
            warn!("No setting found to delete for key: {}", key);
        }

        Ok(deleted)
    }

    pub async fn get_category_map(
        pool: &SqlitePool,
        category: &str,
    ) -> Result<HashMap<String, String>, sqlx::Error> {
        debug!("Building category map for: {}", category);

        let settings = Self::find_by_category(pool, category).await?;

        let mut map = HashMap::new();
        for setting in settings {
            map.insert(
                setting.key.unwrap_or_default(),
                setting.value.unwrap_or_default(),
            );
        }

        debug!(
            "Created category map with {} entries for: {}",
            map.len(),
            category
        );
        Ok(map)
    }

    #[allow(dead_code)]
    pub async fn get_value_as_bool(
        pool: &SqlitePool,
        key: &str,
    ) -> Result<bool, Box<dyn std::error::Error>> {
        debug!("Getting boolean value for key: {}", key);

        let setting = Self::find_by_key(pool, key).await?.ok_or_else(|| {
            warn!("Setting not found for boolean conversion: {}", key);
            format!("Setting not found: {}", key)
        })?;

        let value = setting.value.clone().unwrap_or_default();
        let result = match value.to_lowercase().as_str() {
            "true" => Ok(true),
            "false" => Ok(false),
            _ => {
                error!("Invalid boolean value for key '{}': '{}'", key, value);
                Err(format!("Invalid boolean value for {}: {:?}", key, setting.value).into())
            }
        };

        result
    }

    #[allow(dead_code)]
    pub async fn get_value_as_number(
        pool: &SqlitePool,
        key: &str,
    ) -> Result<i64, Box<dyn std::error::Error>> {
        debug!("Getting numeric value for key: {}", key);

        let setting = Self::find_by_key(pool, key).await?.ok_or_else(|| {
            warn!("Setting not found for numeric conversion: {}", key);
            format!("Setting not found: {}", key)
        })?;

        let value = setting.value.unwrap_or_default();
        match value.parse::<i64>() {
            Ok(parsed) => {
                debug!(
                    "Successfully converted '{}' to number {} for key: {}",
                    value, parsed, key
                );
                Ok(parsed)
            }
            Err(e) => {
                error!(
                    "Failed to parse '{}' as number for key '{}': {}",
                    value, key, e
                );
                Err(format!("Invalid number value for {}: {}", key, e).into())
            }
        }
    }

    pub async fn upsert_setting(
        pool: &SqlitePool,
        key: &str,
        value: String,
        options: Option<UpsertOptions>,
    ) -> Result<(), sqlx::Error> {
        debug!("Upserting setting: key={}, value={}", key, value);

        let exists = Self::find_by_key(pool, key).await?.is_some();

        if exists {
            debug!("Setting exists, updating: {}", key);
            Self::update(pool, key, UpdateSetting { value }).await?;
            Ok(())
        } else {
            debug!("Setting does not exist, creating: {}", key);

            let options = options.ok_or_else(|| {
                error!(
                    "Cannot create setting '{}': missing type and category information",
                    key
                );
                sqlx::Error::Configuration(
                    format!(
                        "Cannot create setting '{}': missing type and category information",
                        key
                    )
                    .into(),
                )
            })?;

            let new_setting = NewSetting {
                key: key.to_string(),
                value,
                value_type: options.value_type,
                category: options.category,
                description: Some(options.description),
            };

            Self::create(pool, new_setting).await?;
            Ok(())
        }
    }
}
