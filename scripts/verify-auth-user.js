// Script para verificar el usuario en auth.users
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL y NEXT_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyAuthUser() {
  try {
    console.log('🔍 Verificando usuarios en auth.users...');

    // Listar todos los usuarios de auth
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error('❌ Error listando usuarios de auth:', authError.message);
      return;
    }

    console.log('📋 Usuarios en auth.users:');
    authUsers.users.forEach((user) => {
      console.log(`- Email: ${user.email}, ID: ${user.id}, Created: ${user.created_at}`);
    });

    const adminUser = authUsers.users.find((user) => user.email === 'admin@sancor.com');

    if (adminUser) {
      console.log('✅ Admin encontrado en auth.users');
      console.log('📧 Email:', adminUser.email);
      console.log('🆔 ID:', adminUser.id);
      console.log('📅 Creado:', adminUser.created_at);
      console.log('✅ Email confirmado:', adminUser.email_confirmed_at ? 'Sí' : 'No');
    } else {
      console.log('❌ Admin NO encontrado en auth.users');
      console.log('🔧 Creando admin en auth.users...');

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
    }
  } catch (error) {
    console.error('❌ Error inesperado:', error.message);
  }
}

verifyAuthUser();
