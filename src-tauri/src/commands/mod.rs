mod graphql;
pub use graphql::*;

#[macro_export]
macro_rules! app_commands {
    () => {
        tauri::generate_handler![commands::send_graphql_request]
    };
}
