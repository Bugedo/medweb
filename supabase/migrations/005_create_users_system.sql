-- Crear tabla de usuarios (para todos los usuarios del sistema)
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS para users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios puedan ver su propio perfil
CREATE POLICY "Users can view own profile" ON users
FOR SELECT USING (auth.jwt() ->> 'email' = email);

-- Política para que los admins puedan ver todos los usuarios
CREATE POLICY "Admins can view all users" ON users
FOR SELECT USING (
    auth.jwt() ->> 'email' IN (
        SELECT email FROM users WHERE role IN ('admin', 'super_admin')
    )
);

-- Política para que los super_admins puedan gestionar usuarios
CREATE POLICY "Super admins can manage users" ON users
FOR ALL USING (
    auth.jwt() ->> 'email' IN (
        SELECT email FROM users WHERE role = 'super_admin'
    )
);

-- Crear función para auto-crear usuario cuando se registra en auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        'user'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger para auto-crear usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Crear función para verificar si un usuario es admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE email = auth.jwt() ->> 'email'
        AND role IN ('admin', 'super_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear función para obtener el rol del usuario
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
    RETURN (
        SELECT role FROM users 
        WHERE email = auth.jwt() ->> 'email'
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Actualizar políticas RLS de las tablas existentes para usar la nueva función
DROP POLICY IF EXISTS "Only admins can access prefichas" ON prefichas;
DROP POLICY IF EXISTS "Only admins can access datos_cliente" ON datos_cliente;
DROP POLICY IF EXISTS "Only admins can access beneficiario_seguro_vida" ON beneficiario_seguro_vida;
DROP POLICY IF EXISTS "Only admins can access tercero_pagador" ON tercero_pagador;
DROP POLICY IF EXISTS "Only admins can access informacion_adicional" ON informacion_adicional;

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

-- Crear índices para mejorar performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Eliminar la tabla admins ya que ahora usamos users
DROP TABLE IF EXISTS admins CASCADE;
