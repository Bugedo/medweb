// Script para crear el usuario admin
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL y NEXT_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdmin() {
  try {
    console.log('🔐 Creando usuario admin...');

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@sancor.com',
      password: '123456',
      email_confirm: true,
      user_metadata: {
        name: 'Administrador Principal',
      },
    });

    if (authError) {
      console.error('❌ Error creando usuario en Auth:', authError.message);
      return;
    }

    console.log('✅ Usuario creado en Auth:', authData.user.email);

    // Actualizar rol en la tabla users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .update({
        role: 'super_admin',
        name: 'Administrador Principal',
      })
      .eq('email', 'admin@sancor.com')
      .select();

    if (userError) {
      console.error('❌ Error actualizando rol:', userError.message);
      return;
    }

    console.log('✅ Rol de admin asignado:', userData[0]);
    console.log('🎉 ¡Admin creado exitosamente!');
    console.log('📧 Email: admin@sancor.com');
    console.log('🔑 Contraseña: 123456');
    console.log('🔗 URL: /admin/login');
  } catch (error) {
    console.error('❌ Error inesperado:', error.message);
  }
}

createAdmin();
