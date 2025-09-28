const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Variables de entorno:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? '✅ Presente' : '❌ Faltante');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Faltan variables de entorno');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  try {
    console.log('🔐 Probando login...');

    // Intentar hacer login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@admin.com',
      password: '123456',
    });

    if (error) {
      console.error('❌ Error en login:', error.message);
      return;
    }

    console.log('✅ Login exitoso!');
    console.log('👤 User ID:', data.user.id);
    console.log('📧 Email:', data.user.email);

    // Verificar usuario en tabla users
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@admin.com')
      .single();

    if (userError) {
      console.error('❌ Error obteniendo usuario:', userError.message);
      return;
    }

    console.log('✅ Usuario encontrado en tabla users:');
    console.log('👤 Name:', user.name);
    console.log('🔑 Role:', user.role);
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

testLogin();
