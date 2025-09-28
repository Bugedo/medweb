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

async function testContactForm() {
  try {
    console.log('🧪 Probando formulario de contacto...');

    // Datos de prueba
    const testContact = {
      nombre: 'Usuario de Prueba',
      localidad: 'Buenos Aires, CABA',
      dni: '12345678',
      telefono: '+54 11 1234-5678',
      email: 'prueba@email.com',
      status: 'pending',
    };

    // Insertar contacto directamente
    const { data, error } = await supabase
      .from('contactos')
      .insert([testContact])
      .select()
      .single();

    if (error) {
      console.error('❌ Error insertando contacto:', error.message);
      return;
    }

    console.log('✅ Contacto insertado exitosamente:');
    console.log(`   ID: ${data.id}`);
    console.log(`   Nombre: ${data.nombre}`);
    console.log(`   Email: ${data.email}`);
    console.log(`   Estado: ${data.status}`);
    console.log(`   Fecha: ${new Date(data.created_at).toLocaleString()}`);

    // Verificar que aparece en la lista
    console.log('\n🔍 Verificando que aparece en la lista...');
    const { data: allContacts, error: fetchError } = await supabase
      .from('contactos')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('❌ Error obteniendo contactos:', fetchError.message);
      return;
    }

    console.log(`📊 Total de contactos ahora: ${allContacts.length}`);

    // Buscar nuestro contacto
    const ourContact = allContacts.find((c) => c.email === testContact.email);
    if (ourContact) {
      console.log('✅ Contacto encontrado en la lista');
    } else {
      console.log('❌ Contacto no encontrado en la lista');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testContactForm();
