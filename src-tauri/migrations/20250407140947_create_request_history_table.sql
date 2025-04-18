-- Add migration script here
CREATE TABLE request_history (
  id TEXT PRIMARY KEY,
  endpoint_id TEXT NOT NULL,
  name TEXT,
  method TEXT NOT NULL,
  headers TEXT,
  body TEXT,
  query TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
)