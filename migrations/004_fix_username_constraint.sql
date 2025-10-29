-- Make username column nullable since we're using full_name now
ALTER TABLE users ALTER COLUMN username DROP NOT NULL;

-- Update existing records to have a username if they don't have one
UPDATE users SET username = CONCAT('user_', id) WHERE username IS NULL;

-- Make username unique but still nullable
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_username_key;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_unique ON users(username) WHERE username IS NOT NULL;
