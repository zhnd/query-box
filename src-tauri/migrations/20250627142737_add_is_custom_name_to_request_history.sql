-- Add migration script here
ALTER TABLE request_history
ADD COLUMN is_custom_name BOOLEAN DEFAULT FALSE;