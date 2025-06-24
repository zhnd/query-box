use log::{error, info};
use once_cell::sync::Lazy;
use reqwest::Client;
use std::time::Duration;

pub static HTTP_CLIENT: Lazy<Client> = Lazy::new(|| {
    info!("Initializing HTTP client with a timeout of 30 seconds");

    match Client::builder().timeout(Duration::from_secs(30)).build() {
        Ok(client) => client,
        Err(e) => {
            error!("Failed to build HTTP client: {}", e);
            panic!("Failed to build HTTP client");
        }
    }
});
