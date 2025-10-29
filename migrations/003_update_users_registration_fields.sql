-- Update users table with new registration fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(200);
ALTER TABLE users ADD COLUMN IF NOT EXISTS college_university VARCHAR(200);
ALTER TABLE users ADD COLUMN IF NOT EXISTS course VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS batch_no VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS reg_no VARCHAR(50) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' NOT NULL;

-- Add constraint to ensure status is either 'active' or 'inactive'
ALTER TABLE users ADD CONSTRAINT check_status CHECK (status IN ('active', 'inactive'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_reg_no ON users(reg_no);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_batch_no ON users(batch_no);

-- Remove old first_name and last_name columns (we'll use full_name now)
-- Note: This is commented out for safety. Uncomment only after data migration if needed
-- ALTER TABLE users DROP COLUMN IF EXISTS first_name;
-- ALTER TABLE users DROP COLUMN IF EXISTS last_name;
