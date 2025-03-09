use sqlx::sqlite::{SqliteConnectOptions, SqliteJournalMode, SqlitePool};
use std::{fs::create_dir_all, str::FromStr};
use tauri::{AppHandle, Manager};

pub async fn initialize_db(app_handle: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let app_data_dir = app_handle
        .path()
        .app_local_data_dir()
        .expect("Could not get app data directory");

    create_dir_all(&app_data_dir).expect("Could not create app data directory");
    let db_path = app_data_dir.join("app.sqlite");

    let connection_string = format!("sqlite:{}", db_path.to_string_lossy());

    let opts = SqliteConnectOptions::from_str(&connection_string)?
        .journal_mode(SqliteJournalMode::Wal)
        .create_if_missing(true);

    let pool = SqlitePool::connect_with(opts).await?;

    app_handle.manage(pool);
    println!("Database connection established successfully");

    Ok(())
}

pub async fn run_migrations(app_handle: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let pool = app_handle.state::<SqlitePool>();

    let current_dir = std::env::current_dir()?;
    let migrations_path = current_dir.join("migrations");

    if migrations_path.exists() {
        match sqlx::migrate::Migrator::new(migrations_path).await {
            Ok(migrator) => match migrator.run(&*pool).await {
                Ok(_) => println!("migrations run successfully"),
                Err(e) => {
                    println!("migrator failed to run: {}", e);
                    return Err(Box::new(e));
                }
            },
            Err(e) => {
                println!("migrator failed to load: {}", e);
                return Err(Box::new(e));
            }
        }
    } else {
        println!("migration path does not exist");
    }
    Ok(())
}

pub async fn setup(app_handle: &tauri::AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    initialize_db(app_handle).await?;
    run_migrations(app_handle).await?;

    create_test_data(app_handle).await?;
    Ok(())
}

pub async fn create_test_data(
    app_handle: &tauri::AppHandle,
) -> Result<(), Box<dyn std::error::Error>> {
    let pool = app_handle.state::<SqlitePool>();

    sqlx::query(
        r#"
        INSERT INTO endpoints (name, url)
        VALUES
            ('Google', 'https://www.google.com'),
            ('Bing', 'https://www.bing.com'),
            ('DuckDuckGo', 'https://www.duckduckgo.com')
        "#,
    )
    .execute(&*pool)
    .await?;

    Ok(())
}
