require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableStructure() {
  console.log('🔍 Verificando estructura de la tabla prefichas...\n');

  try {
    // Obtener todas las prefichas sin especificar columnas
    const { data: prefichas, error } = await supabase
      .from('prefichas')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error al obtener prefichas:', error);
      return;
    }

    if (prefichas && prefichas.length > 0) {
      console.log('📋 Estructura de la tabla prefichas:');
      const preficha = prefichas[0];
      Object.keys(preficha).forEach(key => {
        console.log(`  - ${key}: ${typeof preficha[key]} = ${JSON.stringify(preficha[key]).substring(0, 100)}...`);
      });
    } else {
      console.log('📭 No hay prefichas en la tabla');
    }

    // Verificar si existe la columna status
    const { data: statusCheck, error: statusError } = await supabase
      .from('prefichas')
      .select('status')
      .limit(1);

    if (statusError) {
      console.log('❌ La columna status NO existe:', statusError.message);
    } else {
      console.log('✅ La columna status existe');
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkTableStructure();
