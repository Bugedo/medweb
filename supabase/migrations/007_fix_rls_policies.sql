-- Arreglar las políticas RLS para la tabla users
-- Primero, eliminar todas las políticas existentes
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Super admins can manage users" ON users;

-- Crear políticas más simples y funcionales
-- Política para que los usuarios puedan ver su propio perfil
CREATE POLICY "Users can view own profile" ON users
FOR SELECT USING (auth.jwt() ->> 'email' = email);

-- Política para que los admins puedan ver todos los usuarios
CREATE POLICY "Admins can view all users" ON users
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM users u 
        WHERE u.email = auth.jwt() ->> 'email' 
        AND u.role IN ('admin', 'super_admin')
    )
);

-- Política para que los super_admins puedan gestionar usuarios
CREATE POLICY "Super admins can manage users" ON users
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users u 
        WHERE u.email = auth.jwt() ->> 'email' 
        AND u.role = 'super_admin'
    )
);

-- Verificar que el admin tenga el rol correcto
UPDATE users 
SET role = 'super_admin', name = 'Administrador Principal'
WHERE email = 'admin@sancor.com';

-- Verificar el resultado
SELECT email, name, role, created_at FROM users WHERE email = 'admin@sancor.com';
