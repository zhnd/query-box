-- Add migration script here
CREATE TABLE function (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  code TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE function_variable (
  id TEXT PRIMARY KEY,
  function_id TEXT NOT NULL REFERENCES function(id) on DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  default_value TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE function_binding (
  id TEXT PRIMARY KEY,
  function_id TEXT NOT NULL REFERENCES function(id) on DELETE CASCADE,
  endpoint_id TEXT NOT NULL REFERENCES endpoint(id) on DELETE CASCADE,
  variable_values TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);