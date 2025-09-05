/*
  # Setup Admin User Access

  1. Instructions
    - This script helps you set up admin access for your user account
    - Replace 'your-email@example.com' with your actual email address
    - Run this script in your Supabase SQL Editor after signing up

  2. What this does
    - Updates your user's metadata to include admin privileges
    - Allows you to access the admin dashboard

  3. Security
    - Only run this for trusted admin users
    - In production, implement proper role-based access control
*/

-- Replace 'your-email@example.com' with your actual email address
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": "true"}'::jsonb
WHERE email = 'your-email@example.com';

-- Alternative: If you want to set admin for the first user (be careful in production)
-- UPDATE auth.users 
-- SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": "true"}'::jsonb
-- WHERE created_at = (SELECT MIN(created_at) FROM auth.users);

-- Verify the update worked (optional - run this to check)
-- SELECT email, raw_user_meta_data->'is_admin' as is_admin 
-- FROM auth.users 
-- WHERE email = 'your-email@example.com';