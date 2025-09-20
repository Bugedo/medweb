// Script para verificar y crear el admin si no existe
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL y NEXT_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAndCreateAdmin() {
  try {
    console.log('🔍 Verificando si el admin existe...');

    // Verificar si existe en la tabla users
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@sancor.com')
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.error('❌ Error verificando usuario:', userError.message);
      return;
    }

    if (existingUser) {
      console.log('✅ Admin ya existe en la tabla users:');
      console.log('📧 Email:', existingUser.email);
      console.log('👑 Rol:', existingUser.role);
      console.log('📅 Creado:', existingUser.created_at);
      return;
    }

    console.log('❌ Admin no existe en la tabla users. Creando...');

    // Verificar si existe en auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error('❌ Error listando usuarios de auth:', authError.message);
      return;
    }

    const authUser = authUsers.users.find((user) => user.email === 'admin@sancor.com');

    if (!authUser) {
      console.log('🔐 Creando usuario en Supabase Auth...');

      // Crear usuario en Supabase Auth
      const { data: authData, error: authCreateError } = await supabase.auth.admin.createUser({
        email: 'admin@sancor.com',
        password: '123456',
        email_confirm: true,
        user_metadata: {
          name: 'Administrador Principal',
        },
      });

      if (authCreateError) {
        console.error('❌ Error creando usuario en Auth:', authCreateError.message);
        return;
      }

      console.log('✅ Usuario creado en Auth:', authData.user.email);
    } else {
      console.log('✅ Usuario ya existe en Auth:', authUser.email);
    }

    // Crear usuario en la tabla users
    const { data: userData, error: userCreateError } = await supabase
      .from('users')
      .insert({
        email: 'admin@sancor.com',
        name: 'Administrador Principal',
        role: 'super_admin',
      })
      .select();

    if (userCreateError) {
      console.error('❌ Error creando usuario en tabla users:', userCreateError.message);
      return;
    }

    console.log('✅ Usuario creado en tabla users:', userData[0]);
    console.log('🎉 ¡Admin configurado exitosamente!');
    console.log('📧 Email: admin@sancor.com');
    console.log('🔑 Contraseña: 123456');
    console.log('🔗 URL: /admin/login');
  } catch (error) {
    console.error('❌ Error inesperado:', error.message);
  }
}

checkAndCreateAdmin();
