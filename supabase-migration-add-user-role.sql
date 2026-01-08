-- Add role column to users table
-- This migration adds a role field to track user permissions (customer, dealer, admin)

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'dealer', 'admin'));

-- Add comment to document the column
COMMENT ON COLUMN users.role IS 'User role: customer (default), dealer (can view quantities), admin (full access)';

-- Optional: Update existing users to have the customer role if NULL
UPDATE users 
SET role = 'customer' 
WHERE role IS NULL;
