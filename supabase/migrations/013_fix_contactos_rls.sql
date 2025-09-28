-- Arreglar RLS para permitir inserción pública en contactos
-- La política actual solo permite a admins leer, pero no permite inserción pública

-- Eliminar política existente si existe
DROP POLICY IF EXISTS "Permitir inserción pública en contactos" ON contactos;

-- Crear nueva política que permita inserción pública
CREATE POLICY "Permitir inserción pública en contactos" ON contactos
    FOR INSERT WITH CHECK (true);

-- Verificar que la política de lectura para admins sigue funcionando
DROP POLICY IF EXISTS "Solo admins pueden leer contactos" ON contactos;
CREATE POLICY "Solo admins pueden leer contactos" ON contactos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );
