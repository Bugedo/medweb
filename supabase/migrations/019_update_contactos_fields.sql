-- Migration: Update contactos table
-- Remove dni column, make email optional, add observaciones column

-- Remove dni column
ALTER TABLE contactos DROP COLUMN IF EXISTS dni;

-- Make email nullable (optional)
ALTER TABLE contactos ALTER COLUMN email DROP NOT NULL;

-- Add observaciones column
ALTER TABLE contactos ADD COLUMN IF NOT EXISTS observaciones TEXT;

-- Add comment to document changes
COMMENT ON COLUMN contactos.email IS 'Email is now optional';
COMMENT ON COLUMN contactos.observaciones IS 'Optional observations or comments from the contact form';

