-- Crear tabla para formulario de contacto
CREATE TABLE contactos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    localidad TEXT NOT NULL,
    dni TEXT NOT NULL,
    telefono TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar performance
CREATE INDEX idx_contactos_created_at ON contactos(created_at);
CREATE INDEX idx_contactos_email ON contactos(email);

-- Habilitar RLS (Row Level Security)
ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserción pública (formulario de contacto)
CREATE POLICY "Permitir inserción pública en contactos" ON contactos
    FOR INSERT WITH CHECK (true);

-- Política para que solo admins puedan leer contactos
CREATE POLICY "Solo admins pueden leer contactos" ON contactos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );
