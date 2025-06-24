use log::{error, info, warn};
use sqlx::sqlite::{SqliteConnectOptions, SqlitePool};
use std::{fs::create_dir_all, str::FromStr};
use tauri::{AppHandle, Manager};

pub async fn initialize_db(app_handle: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let app_data_dir = match app_handle.path().app_local_data_dir() {
        Ok(dir) => dir,
        Err(e) => {
            error!("Failed to get app local data directory: {}", e);
            return Err(Box::new(e));
        }
    };

    if let Err(e) = create_dir_all(&app_data_dir) {
        error!("Error creating app data directory: {}", e);
        return Err(Box::new(e));
    }
    let db_path = app_data_dir.join("app.sqlite");

    let connection_string = format!("sqlite:{}", db_path.to_string_lossy());

    let opts = match SqliteConnectOptions::from_str(&connection_string) {
        Ok(options) => options.create_if_missing(true),
        Err(e) => {
            error!("Error parsing database connection string: {}", e);
            return Err(Box::new(e));
        }
    };

    let pool = SqlitePool::connect_with(opts).await.map_err(|e| {
        error!("Error connecting to database: {}", e);
        e
    })?;

    app_handle.manage(pool);
    info!("Database connection established successfully");

    Ok(())
}

pub async fn run_migrations(app_handle: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let pool = app_handle.state::<SqlitePool>();

    let resource_dir = app_handle.path().resource_dir().or_else(|err| {
        error!("Failed to get resource directory: {}", err);
        Err(std::io::Error::new(
            std::io::ErrorKind::NotFound,
            "Resource directory not found",
        ))
    })?;

    let migrations_path = resource_dir.join("migrations");
    info!("Migrations path: {:?}", migrations_path);

    if !migrations_path.exists() {
        warn!("Migrations path does not exist: {:?}", migrations_path);
        return Err(Box::new(std::io::Error::new(
            std::io::ErrorKind::NotFound,
            "Migrations path not found",
        )));
    }

    let migrator = match sqlx::migrate::Migrator::new(migrations_path).await {
        Ok(migrator) => migrator,
        Err(e) => {
            error!("Failed to load migrator: {}", e);
            return Err(Box::new(e));
        }
    };

    match migrator.run(&*pool).await {
        Ok(_) => info!("migrations run successfully"),
        Err(e) => {
            error!("migrator failed to run: {}", e);
            return Err(Box::new(e));
        }
    }

    Ok(())
}

pub async fn setup(app_handle: &tauri::AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    info!("Setting up the database...");

    if let Err(e) = initialize_db(app_handle).await {
        error!("Error initializing database: {}", e);
        return Err(e);
    }
    if let Err(e) = run_migrations(app_handle).await {
        error!("Error running migrations: {}", e);
        return Err(e);
    }
    info!("Database setup completed successfully");
    Ok(())
}
