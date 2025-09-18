-- Crear bucket para archivos de preficha
INSERT INTO storage.buckets (id, name, public)
VALUES ('preficha-files', 'preficha-files', false);

-- Crear políticas para el storage
CREATE POLICY "Allow uploads to preficha-files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'preficha-files');

CREATE POLICY "Allow downloads from preficha-files" ON storage.objects
FOR SELECT USING (bucket_id = 'preficha-files');

CREATE POLICY "Allow updates to preficha-files" ON storage.objects
FOR UPDATE USING (bucket_id = 'preficha-files');

CREATE POLICY "Allow deletes from preficha-files" ON storage.objects
FOR DELETE USING (bucket_id = 'preficha-files');
