require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno faltantes');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.log('NEXT_SERVICE_ROLE_KEY:', !!supabaseKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugPrefichas() {
  console.log('🔍 Debugging prefichas...\n');

  try {
    // 1. Verificar estructura de la tabla
    console.log('1️⃣ Verificando estructura de la tabla prefichas...');
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', 'prefichas')
      .eq('table_schema', 'public');

    if (columnsError) {
      console.error('❌ Error al obtener columnas:', columnsError);
    } else {
      console.log('📋 Columnas de la tabla prefichas:');
      columns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable}, default: ${col.column_default})`);
      });
    }

    // 2. Obtener todas las prefichas con sus status
    console.log('\n2️⃣ Obteniendo todas las prefichas...');
    const { data: prefichas, error: prefichasError } = await supabase
      .from('prefichas')
      .select('id, status, created_at, datos_cliente')
      .order('created_at', { ascending: false })
      .limit(5);

    if (prefichasError) {
      console.error('❌ Error al obtener prefichas:', prefichasError);
    } else {
      console.log('📊 Prefichas encontradas:');
      prefichas.forEach((preficha, index) => {
        const cliente = preficha.datos_cliente?.[0];
        console.log(`  ${index + 1}. ID: ${preficha.id}`);
        console.log(`     Status: ${preficha.status || 'NULL'}`);
        console.log(`     Cliente: ${cliente?.nombre_cliente} ${cliente?.apellido_cliente}`);
        console.log(`     Creado: ${preficha.created_at}`);
        console.log('');
      });
    }

    // 3. Intentar actualizar una preficha de prueba
    if (prefichas && prefichas.length > 0) {
      const testPreficha = prefichas[0];
      console.log(`3️⃣ Probando actualización de preficha ${testPreficha.id}...`);
      
      const { data: updateData, error: updateError } = await supabase
        .from('prefichas')
        .update({ status: 'completed' })
        .eq('id', testPreficha.id)
        .select();

      if (updateError) {
        console.error('❌ Error al actualizar:', updateError);
      } else {
        console.log('✅ Actualización exitosa:', updateData);
      }

      // Verificar el cambio
      const { data: verifyData, error: verifyError } = await supabase
        .from('prefichas')
        .select('id, status')
        .eq('id', testPreficha.id)
        .single();

      if (verifyError) {
        console.error('❌ Error al verificar:', verifyError);
      } else {
        console.log('🔍 Verificación:', verifyData);
      }
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

debugPrefichas();
