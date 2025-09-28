const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAdminUser() {
  try {
    console.log('🔍 Verificando usuario admin...');

    // Buscar usuario en tabla users
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@admin.com');

    if (userError) {
      console.error('❌ Error buscando usuario:', userError.message);
      return;
    }

    if (users && users.length > 0) {
      const user = users[0];
      console.log('✅ Usuario admin encontrado:');
      console.log('📧 Email:', user.email);
      console.log('👤 Name:', user.name);
      console.log('🔑 Role:', user.role);
      console.log('🆔 ID:', user.id);
      console.log('📅 Created:', user.created_at);
    } else {
      console.log('❌ Usuario admin no encontrado');
    }
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

checkAdminUser();
