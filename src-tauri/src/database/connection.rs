use sqlx::sqlite::{SqliteConnectOptions, SqlitePool};
use std::{fs::create_dir_all, str::FromStr};
use tauri::{AppHandle, Manager};

pub async fn initialize_db(app_handle: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let app_data_dir = app_handle
        .path()
        .app_local_data_dir()
        .expect("Could not get app data directory");

    if let Err(e) = create_dir_all(&app_data_dir) {
        eprintln!("Error creating app data directory: {}", e);
        return Err(Box::new(e));
    }
    let db_path = app_data_dir.join("app.sqlite");

    let connection_string = format!("sqlite:{}", db_path.to_string_lossy());

    let opts = SqliteConnectOptions::from_str(&connection_string)?.create_if_missing(true);

    let pool = SqlitePool::connect_with(opts).await.map_err(|e| {
        eprintln!("Error connecting to database: {}", e);
        e
    })?;

    app_handle.manage(pool);
    println!("Database connection established successfully");

    Ok(())
}

pub async fn run_migrations(app_handle: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let pool = app_handle.state::<SqlitePool>();

    let resource_dir = app_handle.path().resource_dir().or_else(|err| {
        println!("Failed to get resource directory: {}", err);
        Err(std::io::Error::new(
            std::io::ErrorKind::NotFound,
            "Resource directory not found",
        ))
    })?;

    let migrations_path = resource_dir.join("migrations");

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
    Ok(())
}
