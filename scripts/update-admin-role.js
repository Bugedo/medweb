const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateAdminRole() {
  try {
    console.log('🔧 Actualizando role del usuario admin...');

    // Actualizar role a admin
    const { error: updateError } = await supabase
      .from('users')
      .update({ role: 'admin' })
      .eq('email', 'admin@admin.com');

    if (updateError) {
      console.error('❌ Error actualizando role:', updateError.message);
      return;
    }

    console.log('✅ Role actualizado a admin exitosamente!');
    console.log('📧 Email: admin@admin.com');
    console.log('🔑 Password: 123456');
    console.log('👤 Role: admin');
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

updateAdminRole();
