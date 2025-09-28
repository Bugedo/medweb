-- Verificar y arreglar políticas RLS para contactos
-- Primero, verificar si RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'contactos';

-- Deshabilitar RLS temporalmente para debug
ALTER TABLE contactos DISABLE ROW LEVEL SECURITY;

-- Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "Permitir inserción pública en contactos" ON contactos;
DROP POLICY IF EXISTS "Solo admins pueden leer contactos" ON contactos;

-- Habilitar RLS nuevamente
ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;

-- Crear política que permita inserción pública (sin autenticación)
CREATE POLICY "Permitir inserción pública en contactos" ON contactos
    FOR INSERT WITH CHECK (true);

-- Crear política que permita lectura solo a admins autenticados
CREATE POLICY "Solo admins pueden leer contactos" ON contactos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- Verificar que las políticas se crearon correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'contactos';
