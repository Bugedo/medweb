// Script para recrear el usuario admin
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL y NEXT_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function recreateAdmin() {
  try {
    console.log('🔍 Verificando y recreando admin...');

    // 1. Eliminar usuario existente de auth.users si existe
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const existingAuthUser = authUsers.users.find((user) => user.email === 'admin@sancor.com');

    if (existingAuthUser) {
      console.log('🗑️ Eliminando usuario existente de auth.users...');
      const { error: deleteError } = await supabase.auth.admin.deleteUser(existingAuthUser.id);
      if (deleteError) {
        console.error('❌ Error eliminando usuario de auth:', deleteError.message);
      } else {
        console.log('✅ Usuario eliminado de auth.users');
      }
    }

    // 2. Eliminar usuario de la tabla users
    const { error: deleteUserError } = await supabase
      .from('users')
      .delete()
      .eq('email', 'admin@sancor.com');

    if (deleteUserError) {
      console.error('❌ Error eliminando usuario de tabla users:', deleteUserError.message);
    } else {
      console.log('✅ Usuario eliminado de tabla users');
    }

    // 3. Crear nuevo usuario en auth.users
    console.log('🔐 Creando nuevo usuario en auth.users...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@sancor.com',
      password: '123456',
      email_confirm: true,
      user_metadata: {
        name: 'Administrador Principal',
      },
    });

    if (authError) {
      console.error('❌ Error creando usuario en auth:', authError.message);
      return;
    }

    console.log('✅ Usuario creado en auth.users:', authData.user.email);

    // 4. Crear usuario en la tabla users
    console.log('👤 Creando usuario en tabla users...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .upsert({
        id: authData.user.id,
        email: 'admin@sancor.com',
        name: 'Administrador Principal',
        role: 'super_admin',
      })
      .select();

    if (userError) {
      console.error('❌ Error creando usuario en tabla users:', userError.message);
      return;
    }

    console.log('✅ Usuario creado en tabla users:', userData[0]);

    // 5. Probar login
    console.log('🧪 Probando login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'admin@sancor.com',
      password: '123456',
    });

    if (loginError) {
      console.error('❌ Error en login de prueba:', loginError.message);
    } else {
      console.log('✅ Login de prueba exitoso:', loginData.user.email);
    }

    console.log('🎉 ¡Admin recreado exitosamente!');
    console.log('📧 Email: admin@sancor.com');
    console.log('🔑 Contraseña: 123456');
    console.log('🔗 URL: /admin/login');
  } catch (error) {
    console.error('❌ Error inesperado:', error.message);
  }
}

recreateAdmin();
