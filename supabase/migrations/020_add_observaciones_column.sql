-- Add observaciones column to contactos table
ALTER TABLE contactos ADD COLUMN IF NOT EXISTS observaciones TEXT;

-- Add comment to document the change
COMMENT ON COLUMN contactos.observaciones IS 'Optional observations or comments from the contact form';
