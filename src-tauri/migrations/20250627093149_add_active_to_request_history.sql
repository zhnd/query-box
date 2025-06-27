-- Add migration script here
ALTER TABLE request_history
ADD COLUMN active BOOLEAN DEFAULT FALSE;