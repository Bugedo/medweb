// Script para crear vendedores iniciales
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL y NEXT_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createVendors() {
  try {
    console.log('👥 Creando vendedores iniciales...');

    const vendors = [
      {
        name: 'Juan Pérez',
        email: 'juan.perez@sancor.com',
        phone: '0351-1234567',
        code: 'VEN001',
      },
      {
        name: 'María González',
        email: 'maria.gonzalez@sancor.com',
        phone: '0351-2345678',
        code: 'VEN002',
      },
      {
        name: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@sancor.com',
        phone: '0351-3456789',
        code: 'VEN003',
      },
      {
        name: 'Ana Martínez',
        email: 'ana.martinez@sancor.com',
        phone: '0351-4567890',
        code: 'VEN004',
      },
      {
        name: 'Luis Fernández',
        email: 'luis.fernandez@sancor.com',
        phone: '0351-5678901',
        code: 'VEN005',
      },
      {
        name: 'Sofía López',
        email: 'sofia.lopez@sancor.com',
        phone: '0351-6789012',
        code: 'VEN006',
      },
      {
        name: 'Diego García',
        email: 'diego.garcia@sancor.com',
        phone: '0351-7890123',
        code: 'VEN007',
      },
      {
        name: 'Valentina Ruiz',
        email: 'valentina.ruiz@sancor.com',
        phone: '0351-8901234',
        code: 'VEN008',
      },
    ];

    for (const vendor of vendors) {
      const { data, error } = await supabase
        .from('vendors')
        .upsert(vendor, { onConflict: 'email' })
        .select();

      if (error) {
        console.error(`❌ Error creando vendedor ${vendor.name}:`, error.message);
      } else {
        console.log(`✅ Vendedor creado: ${vendor.name} (${vendor.code})`);
      }
    }

    // Verificar vendedores creados
    const { data: allVendors, error: fetchError } = await supabase
      .from('vendors')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (fetchError) {
      console.error('❌ Error obteniendo vendedores:', fetchError.message);
    } else {
      console.log(`\n🎉 Total de vendedores activos: ${allVendors.length}`);
      console.log('📋 Lista de vendedores:');
      allVendors.forEach((vendor) => {
        console.log(`   • ${vendor.name} (${vendor.code}) - ${vendor.email}`);
      });
    }
  } catch (error) {
    console.error('❌ Error inesperado:', error.message);
  }
}

createVendors();
