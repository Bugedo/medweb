require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function getAllColumns() {
  console.log('🔍 Obteniendo todas las columnas de prefichas...\n');

  try {
    const { data: prefichas, error } = await supabase
      .from('prefichas')
      .select('*')
      .limit(3);

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    if (prefichas && prefichas.length > 0) {
      console.log('📋 Todas las columnas disponibles:');
      const preficha = prefichas[0];
      Object.keys(preficha).forEach(key => {
        const value = preficha[key];
        console.log(`  - ${key}: ${typeof value}`);
        if (typeof value === 'object' && value !== null) {
          console.log(`    Contenido: ${JSON.stringify(value, null, 2)}`);
        } else {
          console.log(`    Valor: ${value}`);
        }
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

getAllColumns();
