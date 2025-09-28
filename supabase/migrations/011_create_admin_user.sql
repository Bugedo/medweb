-- Crear usuario admin
-- Este script debe ejecutarse manualmente en el SQL Editor de Supabase
-- ya que la creación de usuarios requiere permisos especiales

-- Insertar usuario admin en la tabla users
INSERT INTO users (id, email, name, role, created_at) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@prepagaargentina.com',
  'Administrador',
  'admin',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role;

-- Nota: Para crear el usuario en Auth, ve a Authentication > Users en el dashboard de Supabase
-- y crea manualmente un usuario con:
-- Email: admin@prepagaargentina.com
-- Password: 123456
-- Luego actualiza el ID en la tabla users con el ID real del usuario creado
