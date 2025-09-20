-- Crear tabla de administradores
CREATE TABLE admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS para admins
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Política para que solo los admins puedan ver la tabla de admins
CREATE POLICY "Admins can view admins table" ON admins
FOR SELECT USING (auth.jwt() ->> 'email' IN (SELECT email FROM admins));

-- Política para que solo super_admins puedan insertar/actualizar admins
CREATE POLICY "Super admins can manage admins" ON admins
FOR ALL USING (
    auth.jwt() ->> 'email' IN (
        SELECT email FROM admins WHERE role = 'super_admin'
    )
);

-- Crear función para verificar si un usuario es admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admins 
        WHERE email = auth.jwt() ->> 'email'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear función para obtener el rol del admin
CREATE OR REPLACE FUNCTION get_admin_role()
RETURNS TEXT AS $$
BEGIN
    RETURN (
        SELECT role FROM admins 
        WHERE email = auth.jwt() ->> 'email'
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Actualizar políticas RLS de las tablas existentes para que solo admins puedan acceder
DROP POLICY IF EXISTS "Allow all operations on prefichas" ON prefichas;
DROP POLICY IF EXISTS "Allow all operations on datos_cliente" ON datos_cliente;
DROP POLICY IF EXISTS "Allow all operations on beneficiario_seguro_vida" ON beneficiario_seguro_vida;
DROP POLICY IF EXISTS "Allow all operations on tercero_pagador" ON tercero_pagador;
DROP POLICY IF EXISTS "Allow all operations on informacion_adicional" ON informacion_adicional;

-- Crear nuevas políticas que requieren ser admin
CREATE POLICY "Only admins can access prefichas" ON prefichas
FOR ALL USING (is_admin());

CREATE POLICY "Only admins can access datos_cliente" ON datos_cliente
FOR ALL USING (is_admin());

CREATE POLICY "Only admins can access beneficiario_seguro_vida" ON beneficiario_seguro_vida
FOR ALL USING (is_admin());

CREATE POLICY "Only admins can access tercero_pagador" ON tercero_pagador
FOR ALL USING (is_admin());

CREATE POLICY "Only admins can access informacion_adicional" ON informacion_adicional
FOR ALL USING (is_admin());

-- Crear índice para mejorar performance
CREATE INDEX idx_admins_email ON admins(email);
