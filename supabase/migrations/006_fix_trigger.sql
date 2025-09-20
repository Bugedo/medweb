-- Verificar y arreglar el trigger de auto-creación de usuarios
-- Primero, eliminar el trigger existente si existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Eliminar la función existente si existe
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recrear la función para auto-crear usuario cuando se registra en auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        'user'
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = COALESCE(EXCLUDED.name, users.name),
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recrear el trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verificar que el admin tenga el rol correcto
UPDATE users 
SET role = 'super_admin', name = 'Administrador Principal'
WHERE email = 'admin@sancor.com';

-- Verificar el resultado
SELECT email, name, role, created_at FROM users WHERE email = 'admin@sancor.com';
