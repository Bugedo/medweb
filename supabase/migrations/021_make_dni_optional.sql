-- Make dni column optional in contactos table
ALTER TABLE contactos ALTER COLUMN dni DROP NOT NULL;

-- Add comment to document the change
COMMENT ON COLUMN contactos.dni IS 'DNI is now optional';
