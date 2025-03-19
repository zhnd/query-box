-- Add migration script here
CREATE TABLE endpoint (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  endpoint_type TEXT NOT NULL,
  url TEXT NOT NULL,
  auth TEXT,
  config TEXT,
  headers TEXT,
  favorite INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
)