-- Deshabilitar RLS completamente para la tabla contactos
-- Esto permitirá inserción pública sin restricciones

-- Deshabilitar RLS
ALTER TABLE contactos DISABLE ROW LEVEL SECURITY;

-- Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "Permitir inserción pública en contactos" ON contactos;
DROP POLICY IF EXISTS "Solo admins pueden leer contactos" ON contactos;

-- Verificar que RLS está deshabilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'contactos';
