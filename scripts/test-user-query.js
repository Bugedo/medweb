// Script para probar la consulta de usuarios
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL y NEXT_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testUserQuery() {
  try {
    console.log('🔍 Probando consulta de usuarios...');

    // Probar consulta con service key (bypass RLS)
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@sancor.com');

    if (usersError) {
      console.error('❌ Error consultando usuarios:', usersError.message);
      return;
    }

    console.log('✅ Usuarios encontrados:', users);

    // Probar consulta con anon key (con RLS)
    const supabaseAnon = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    const { data: usersAnon, error: usersAnonError } = await supabaseAnon
      .from('users')
      .select('*')
      .eq('email', 'admin@sancor.com');

    console.log('🔍 Consulta con anon key:');
    console.log('📊 Datos:', usersAnon);
    console.log('❌ Error:', usersAnonError);
  } catch (error) {
    console.error('❌ Error inesperado:', error.message);
  }
}

testUserQuery();
