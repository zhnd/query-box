use crate::database::entities::settings::{NewSetting, Setting, UpdateSetting};
use sqlx::SqlitePool;
use std::collections::HashMap;

pub struct SettingsRepository;

impl SettingsRepository {
    pub async fn find_all(pool: &SqlitePool) -> Result<Vec<Setting>, sqlx::Error> {
        sqlx::query_as!(Setting, "SELECT * FROM app_settings ORDER BY category, key")
            .fetch_all(pool)
            .await
    }

    pub async fn find_by_category(
        pool: &SqlitePool,
        category: &str,
    ) -> Result<Vec<Setting>, sqlx::Error> {
        sqlx::query_as!(
            Setting,
            "SELECT * FROM app_settings WHERE category = ? ORDER BY key",
            category
        )
        .fetch_all(pool)
        .await
    }

    pub async fn find_by_key(pool: &SqlitePool, key: &str) -> Result<Option<Setting>, sqlx::Error> {
        sqlx::query_as!(Setting, "SELECT * FROM app_settings WHERE key = ?", key)
            .fetch_optional(pool)
            .await
    }

    pub async fn create(pool: &SqlitePool, setting: NewSetting) -> Result<(), sqlx::Error> {
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

        Ok(())
    }

    pub async fn update(
        pool: &SqlitePool,
        key: &str,
        setting: UpdateSetting,
    ) -> Result<bool, sqlx::Error> {
        let result = sqlx::query!(
            "UPDATE app_settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?",
            setting.value,
            key
        )
        .execute(pool)
        .await?;

        Ok(result.rows_affected() > 0)
    }

    pub async fn delete(pool: &SqlitePool, key: &str) -> Result<bool, sqlx::Error> {
        let result = sqlx::query!("DELETE FROM app_settings WHERE key = ?", key)
            .execute(pool)
            .await?;

        Ok(result.rows_affected() > 0)
    }

    pub async fn get_category_map(
        pool: &SqlitePool,
        category: &str,
    ) -> Result<HashMap<String, String>, sqlx::Error> {
        let settings = Self::find_by_category(pool, category).await?;

        let mut map = HashMap::new();
        for setting in settings {
            map.insert(
                setting.key.unwrap_or_default(),
                setting.value.unwrap_or_default(),
            );
        }

        Ok(map)
    }

    #[allow(dead_code)]
    pub async fn get_value_as_bool(
        pool: &SqlitePool,
        key: &str,
    ) -> Result<bool, Box<dyn std::error::Error>> {
        let setting = Self::find_by_key(pool, key)
            .await?
            .ok_or_else(|| format!("Setting not found: {}", key))?;

        match setting
            .value
            .clone()
            .unwrap_or_default()
            .to_lowercase()
            .as_str()
        {
            "true" => Ok(true),
            "false" => Ok(false),
            _ => Err(format!("Invalid boolean value for {}: {:?}", key, setting.value).into()),
        }
    }
    #[allow(dead_code)]
    pub async fn get_value_as_number(
        pool: &SqlitePool,
        key: &str,
    ) -> Result<i64, Box<dyn std::error::Error>> {
        let setting = Self::find_by_key(pool, key)
            .await?
            .ok_or_else(|| format!("Setting not found: {}", key))?;

        setting
            .value
            .unwrap_or_default()
            .parse::<i64>()
            .map_err(|e| format!("Invalid number value for {}: {}", key, e).into())
    }
}
