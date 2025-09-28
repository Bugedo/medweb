const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function checkRLSPolicies() {
  try {
    console.log('🔍 Verificando políticas RLS para contactos...');

    // Intentar insertar un contacto de prueba
    console.log('🧪 Probando inserción con service role...');

    const testContact = {
      nombre: 'Test RLS Check',
      localidad: 'Buenos Aires, CABA',
      dni: '77777777',
      telefono: '+54 11 7777-7777',
      email: 'test.rls.check@email.com',
      status: 'pending',
    };

    const { data, error } = await supabase
      .from('contactos')
      .insert([testContact])
      .select()
      .single();

    if (error) {
      console.error('❌ Error insertando contacto:', error.message);
      console.error('Código de error:', error.code);
      return;
    }

    console.log('✅ Contacto insertado exitosamente con service role');
    console.log(`   ID: ${data.id}`);
    console.log(`   Nombre: ${data.nombre}`);

    // Limpiar el contacto de prueba
    await supabase.from('contactos').delete().eq('id', data.id);
    console.log('🧹 Contacto de prueba eliminado');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkRLSPolicies();
