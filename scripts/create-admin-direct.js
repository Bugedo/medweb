const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Faltan variables de entorno:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', !!supabaseAnonKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdminUser() {
  try {
    console.log('🔐 Creando usuario admin...');

    // Intentar crear usuario con signup
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@prepagaargentina.com',
      password: '123456',
      options: {
        data: {
          name: 'Administrador',
          role: 'admin',
        },
      },
    });

    if (error) {
      console.error('❌ Error creando usuario:', error.message);
      return;
    }

    if (data.user) {
      console.log('✅ Usuario admin creado exitosamente!');
      console.log('📧 Email: admin@prepagaargentina.com');
      console.log('🔑 Password: 123456');
      console.log('👤 User ID:', data.user.id);

      // Insertar en tabla users
      const { error: userError } = await supabase.from('users').insert({
        id: data.user.id,
        email: 'admin@prepagaargentina.com',
        name: 'Administrador',
        role: 'admin',
        created_at: new Date().toISOString(),
      });

      if (userError) {
        console.error('❌ Error insertando en tabla users:', userError.message);
        return;
      }

      console.log('✅ Usuario insertado en tabla users');
    }
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

createAdminUser();
