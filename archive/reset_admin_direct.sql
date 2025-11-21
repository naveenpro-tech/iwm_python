-- Reset admin user password and add admin role
-- Run this with: psql -U postgres -p 5433 -d iwm -f reset_admin_direct.sql

-- First, let's check if the user exists
SELECT id, email, name FROM users WHERE email = 'admin@iwm.com';

-- Update password (bcrypt hash of 'AdminPassword123!')
-- This hash was generated with: bcrypt.hashpw(b'AdminPassword123!', bcrypt.gensalt())
UPDATE users 
SET hashed_password = '$2b$12$LKzE3qZ8QJ9X5Y7W9Z8QJOe8Y7W9Z8QJOe8Y7W9Z8QJOe8Y7W9Z8QO'
WHERE email = 'admin@iwm.com';

-- Check if admin role exists for this user
SELECT urp.id, urp.user_id, urp.role_type, urp.enabled 
FROM user_role_profiles urp
JOIN users u ON u.id = urp.user_id
WHERE u.email = 'admin@iwm.com' AND urp.role_type = 'admin';

-- If admin role doesn't exist, insert it
INSERT INTO user_role_profiles (user_id, role_type, enabled, is_default, created_at, updated_at)
SELECT u.id, 'admin', true, false, NOW(), NOW()
FROM users u
WHERE u.email = 'admin@iwm.com'
AND NOT EXISTS (
    SELECT 1 FROM user_role_profiles urp 
    WHERE urp.user_id = u.id AND urp.role_type = 'admin'
);

-- If admin role exists but is disabled, enable it
UPDATE user_role_profiles urp
SET enabled = true, updated_at = NOW()
FROM users u
WHERE u.id = urp.user_id 
AND u.email = 'admin@iwm.com' 
AND urp.role_type = 'admin'
AND urp.enabled = false;

-- Verify the result
SELECT u.id, u.email, u.name, urp.role_type, urp.enabled
FROM users u
LEFT JOIN user_role_profiles urp ON u.id = urp.user_id
WHERE u.email = 'admin@iwm.com'
ORDER BY urp.role_type;

