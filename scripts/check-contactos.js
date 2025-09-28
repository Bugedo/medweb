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

async function checkContactos() {
  try {
    console.log('🔍 Verificando contactos en la base de datos...');

    // Obtener todos los contactos
    const { data: contactos, error } = await supabase
      .from('contactos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error obteniendo contactos:', error.message);
      return;
    }

    console.log(`📊 Total de contactos: ${contactos.length}`);

    if (contactos.length === 0) {
      console.log('⚠️  No hay contactos en la base de datos');
      return;
    }

    // Mostrar los últimos 5 contactos
    console.log('\n📋 Últimos contactos:');
    contactos.slice(0, 5).forEach((contacto, index) => {
      console.log(
        `${index + 1}. ${contacto.nombre} (${contacto.email}) - ${contacto.status} - ${new Date(contacto.created_at).toLocaleDateString()}`,
      );
    });

    // Mostrar distribución por estado
    const statusCount = contactos.reduce((acc, contacto) => {
      acc[contacto.status] = (acc[contacto.status] || 0) + 1;
      return acc;
    }, {});

    console.log('\n📈 Distribución por estado:');
    Object.entries(statusCount).forEach(([status, count]) => {
      const labels = {
        pending: 'Pendiente',
        contacted: 'Contactado',
        closed: 'Cliente Cerrado',
        not_interested: 'No Interesado',
      };
      console.log(`  ${labels[status]}: ${count}`);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkContactos();
