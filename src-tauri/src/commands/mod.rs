mod graphql;
pub use graphql::*;

pub mod settings_commands;
pub use settings_commands::*;

#[macro_export]
macro_rules! app_commands {
    () => {
        tauri::generate_handler![
            commands::send_graphql_request,
            commands::get_all_settings,
            commands::get_settings_by_category,
            commands::get_settings_map,
            commands::get_setting,
            commands::update_setting,
            commands::create_setting,
            commands::delete_setting
        ]
    };
}
