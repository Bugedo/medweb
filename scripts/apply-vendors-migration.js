// Script para aplicar la migración de vendedores directamente
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL y NEXT_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyVendorsMigration() {
  try {
    console.log('🚀 Aplicando migración de vendedores...');
    
    // SQL para crear la tabla de vendedores
    const createTableSQL = `
      -- Crear tabla de vendedores
      CREATE TABLE IF NOT EXISTS public.vendors (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone VARCHAR(50),
          code VARCHAR(50) UNIQUE NOT NULL,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `;

    // SQL para agregar columna vendor_id a prefichas
    const addColumnSQL = `
      ALTER TABLE public.prefichas 
      ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES public.vendors(id);
    `;

    // SQL para crear índices
    const createIndexesSQL = `
      CREATE INDEX IF NOT EXISTS idx_vendors_email ON public.vendors(email);
      CREATE INDEX IF NOT EXISTS idx_vendors_code ON public.vendors(code);
      CREATE INDEX IF NOT EXISTS idx_vendors_active ON public.vendors(is_active);
      CREATE INDEX IF NOT EXISTS idx_prefichas_vendor_id ON public.prefichas(vendor_id);
    `;

    // SQL para habilitar RLS
    const enableRLSSQL = `
      ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
    `;

    // SQL para crear políticas RLS
    const createPoliciesSQL = `
      -- Eliminar políticas existentes si existen
      DROP POLICY IF EXISTS "Admins can view all vendors" ON public.vendors;
      DROP POLICY IF EXISTS "Admins can insert vendors" ON public.vendors;
      DROP POLICY IF EXISTS "Admins can update vendors" ON public.vendors;
      DROP POLICY IF EXISTS "Admins can delete vendors" ON public.vendors;

      -- Políticas RLS para vendors
      CREATE POLICY "Admins can view all vendors"
      ON public.vendors FOR SELECT
      USING (
          EXISTS (
              SELECT 1 FROM public.users
              WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
          )
      );

      CREATE POLICY "Admins can insert vendors"
      ON public.vendors FOR INSERT
      WITH CHECK (
          EXISTS (
              SELECT 1 FROM public.users
              WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
          )
      );

      CREATE POLICY "Admins can update vendors"
      ON public.vendors FOR UPDATE
      USING (
          EXISTS (
              SELECT 1 FROM public.users
              WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
          )
      );

      CREATE POLICY "Admins can delete vendors"
      ON public.vendors FOR DELETE
      USING (
          EXISTS (
              SELECT 1 FROM public.users
              WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
          )
      );
    `;

    // SQL para crear función de trigger
    const createTriggerFunctionSQL = `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = timezone('utc'::text, now());
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `;

    // SQL para crear trigger
    const createTriggerSQL = `
      DROP TRIGGER IF EXISTS update_vendors_updated_at ON public.vendors;
      CREATE TRIGGER update_vendors_updated_at 
          BEFORE UPDATE ON public.vendors 
          FOR EACH ROW 
          EXECUTE FUNCTION update_updated_at_column();
    `;

    // SQL para insertar vendedores de ejemplo
    const insertVendorsSQL = `
      INSERT INTO public.vendors (name, email, phone, code) VALUES
      ('Juan Pérez', 'juan.perez@sancor.com', '0351-1234567', 'VEN001'),
      ('María González', 'maria.gonzalez@sancor.com', '0351-2345678', 'VEN002'),
      ('Carlos Rodríguez', 'carlos.rodriguez@sancor.com', '0351-3456789', 'VEN003'),
      ('Ana Martínez', 'ana.martinez@sancor.com', '0351-4567890', 'VEN004'),
      ('Luis Fernández', 'luis.fernandez@sancor.com', '0351-5678901', 'VEN005')
      ON CONFLICT (email) DO NOTHING;
    `;

    // Ejecutar todas las consultas SQL
    console.log('📋 Creando tabla vendors...');
    const { error: tableError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    if (tableError) {
      console.error('❌ Error creando tabla:', tableError.message);
      return;
    }

    console.log('📋 Agregando columna vendor_id a prefichas...');
    const { error: columnError } = await supabase.rpc('exec_sql', { sql: addColumnSQL });
    if (columnError) {
      console.error('❌ Error agregando columna:', columnError.message);
      return;
    }

    console.log('📋 Creando índices...');
    const { error: indexError } = await supabase.rpc('exec_sql', { sql: createIndexesSQL });
    if (indexError) {
      console.error('❌ Error creando índices:', indexError.message);
      return;
    }

    console.log('📋 Habilitando RLS...');
    const { error: rlsError } = await supabase.rpc('exec_sql', { sql: enableRLSSQL });
    if (rlsError) {
      console.error('❌ Error habilitando RLS:', rlsError.message);
      return;
    }

    console.log('📋 Creando políticas RLS...');
    const { error: policiesError } = await supabase.rpc('exec_sql', { sql: createPoliciesSQL });
    if (policiesError) {
      console.error('❌ Error creando políticas:', policiesError.message);
      return;
    }

    console.log('📋 Creando función de trigger...');
    const { error: functionError } = await supabase.rpc('exec_sql', { sql: createTriggerFunctionSQL });
    if (functionError) {
      console.error('❌ Error creando función:', functionError.message);
      return;
    }

    console.log('📋 Creando trigger...');
    const { error: triggerError } = await supabase.rpc('exec_sql', { sql: createTriggerSQL });
    if (triggerError) {
      console.error('❌ Error creando trigger:', triggerError.message);
      return;
    }

    console.log('📋 Insertando vendedores de ejemplo...');
    const { error: insertError } = await supabase.rpc('exec_sql', { sql: insertVendorsSQL });
    if (insertError) {
      console.error('❌ Error insertando vendedores:', insertError.message);
      return;
    }

    console.log('✅ ¡Migración aplicada exitosamente!');
    console.log('🎉 Tabla vendors creada con vendedores de ejemplo');

    // Verificar que la tabla se creó correctamente
    const { data: vendors, error: fetchError } = await supabase
      .from('vendors')
      .select('*')
      .order('name');

    if (fetchError) {
      console.error('❌ Error verificando tabla:', fetchError.message);
    } else {
      console.log(`📊 Vendedores creados: ${vendors.length}`);
      vendors.forEach(vendor => {
        console.log(`   • ${vendor.name} (${vendor.code}) - ${vendor.email}`);
      });
    }

  } catch (error) {
    console.error('❌ Error inesperado:', error.message);
  }
}

applyVendorsMigration();
