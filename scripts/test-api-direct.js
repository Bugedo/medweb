const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Variables de entorno:');
console.log('URL:', supabaseUrl);
console.log('Anon Key:', supabaseAnonKey ? '✅ Presente' : '❌ Faltante');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Faltan variables de entorno');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDirectInsert() {
  try {
    console.log('🧪 Probando inserción directa...');
    
    const testContact = {
      nombre: 'Test API Direct',
      localidad: 'Buenos Aires, CABA',
      dni: '88888888',
      telefono: '+54 11 8888-8888',
      email: 'test.api.direct@email.com',
      status: 'pending'
    };

    const { data, error } = await supabase
      .from('contactos')
      .insert([testContact])
      .select()
      .single();

    if (error) {
      console.error('❌ Error insertando contacto:', error.message);
      console.error('Detalles del error:', error);
      return;
    }

    console.log('✅ Contacto insertado exitosamente:');
    console.log(`   ID: ${data.id}`);
    console.log(`   Nombre: ${data.nombre}`);
    console.log(`   Email: ${data.email}`);

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

testDirectInsert();
