-- Add role column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'student' NOT NULL;

-- Add constraint to ensure role is either 'admin' or 'student'
ALTER TABLE users ADD CONSTRAINT check_role CHECK (role IN ('admin', 'student'));

-- Create index on role for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

