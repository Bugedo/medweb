-- Script para configurar el storage de Supabase
-- Ejecutar este script en el SQL Editor de Supabase Dashboard

-- Crear bucket para archivos de preficha
INSERT INTO storage.buckets (id, name, public)
VALUES ('preficha-files', 'preficha-files', false);

-- Crear política para permitir subir archivos
CREATE POLICY "Allow uploads to preficha-files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'preficha-files');

-- Crear política para permitir leer archivos
CREATE POLICY "Allow downloads from preficha-files" ON storage.objects
FOR SELECT USING (bucket_id = 'preficha-files');

-- Crear política para permitir actualizar archivos
CREATE POLICY "Allow updates to preficha-files" ON storage.objects
FOR UPDATE USING (bucket_id = 'preficha-files');

-- Crear política para permitir eliminar archivos
CREATE POLICY "Allow deletes from preficha-files" ON storage.objects
FOR DELETE USING (bucket_id = 'preficha-files');
