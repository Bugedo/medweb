const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Necesitamos la service key para crear usuarios

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  try {
    console.log('🔐 Creando usuario admin...');

    // Crear usuario en Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@admin.com',
      password: '123456',
      email_confirm: true,
      user_metadata: {
        name: 'Administrador',
        role: 'admin',
      },
    });

    if (authError) {
      console.error('❌ Error creando usuario en Auth:', authError.message);
      return;
    }

    console.log('✅ Usuario creado en Auth:', authData.user.id);

    // Insertar o actualizar en tabla users
    const { error: userError } = await supabase.from('users').upsert({
      id: authData.user.id,
      email: 'admin@admin.com',
      name: 'Administrador',
      role: 'admin',
      created_at: new Date().toISOString(),
    });

    if (userError) {
      console.error('❌ Error insertando en tabla users:', userError.message);
      return;
    }

    console.log('✅ Usuario admin creado exitosamente!');
    console.log('📧 Email: admin@admin.com');
    console.log('🔑 Password: 123456');
    console.log('👤 Role: admin');
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

createAdminUser();
