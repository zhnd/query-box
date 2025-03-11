mod graphql;
pub use graphql::*;

pub mod settings_commands;
pub use settings_commands::*;

///
/// # Command Registration Macro
///
/// NOTE: This macro currently doesn't support type inference or code completion
/// in most IDEs, including VS Code with rust-analyzer. This is due to fundamental
/// limitations in how declarative macros are processed during code analysis.
///
/// When adding new commands:
/// 1. You must manually add the command name with full path
/// 2. There won't be autocomplete suggestions after typing `commands::`
/// 3. Ensure command functions are correctly exported from their modules
///
/// Future improvements may include:
/// - Using a build script or procedural macro to generate code
/// - Adopting a different command registration pattern
/// - Or other solutions as Rust tooling improves
///
/// For now, please refer to the respective module files to find available commands.
///
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
            commands::delete_setting,
            commands::upsert_setting,
        ]
    };
}
