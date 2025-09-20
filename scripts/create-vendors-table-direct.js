// Script para crear la tabla vendors directamente usando el service role
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL y NEXT_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createVendorsTable() {
  try {
    console.log('🚀 Creando tabla vendors...');

    // Crear la tabla vendors usando una consulta SQL directa
    const createTableSQL = `
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

    // Ejecutar la consulta SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: createTableSQL });

    if (error) {
      console.error('❌ Error creando tabla:', error.message);
      return;
    }

    console.log('✅ Tabla vendors creada exitosamente');

    // Agregar columna vendor_id a prefichas
    const addColumnSQL = `
      ALTER TABLE public.prefichas 
      ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES public.vendors(id);
    `;

    const { error: columnError } = await supabase.rpc('exec_sql', { sql: addColumnSQL });

    if (columnError) {
      console.error('❌ Error agregando columna:', columnError.message);
    } else {
      console.log('✅ Columna vendor_id agregada a prefichas');
    }

    // Crear índices
    const createIndexesSQL = `
      CREATE INDEX IF NOT EXISTS idx_vendors_email ON public.vendors(email);
      CREATE INDEX IF NOT EXISTS idx_vendors_code ON public.vendors(code);
      CREATE INDEX IF NOT EXISTS idx_vendors_active ON public.vendors(is_active);
      CREATE INDEX IF NOT EXISTS idx_prefichas_vendor_id ON public.prefichas(vendor_id);
    `;

    const { error: indexError } = await supabase.rpc('exec_sql', { sql: createIndexesSQL });

    if (indexError) {
      console.error('❌ Error creando índices:', indexError.message);
    } else {
      console.log('✅ Índices creados');
    }

    // Habilitar RLS
    const enableRLSSQL = `
      ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
    `;

    const { error: rlsError } = await supabase.rpc('exec_sql', { sql: enableRLSSQL });

    if (rlsError) {
      console.error('❌ Error habilitando RLS:', rlsError.message);
    } else {
      console.log('✅ RLS habilitado');
    }

    // Crear políticas RLS
    const createPoliciesSQL = `
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

    const { error: policiesError } = await supabase.rpc('exec_sql', { sql: createPoliciesSQL });

    if (policiesError) {
      console.error('❌ Error creando políticas:', policiesError.message);
    } else {
      console.log('✅ Políticas RLS creadas');
    }

    // Insertar vendedores de ejemplo
    const insertVendorsSQL = `
      INSERT INTO public.vendors (name, email, phone, code) VALUES
      ('Juan Pérez', 'juan.perez@sancor.com', '0351-1234567', 'VEN001'),
      ('María González', 'maria.gonzalez@sancor.com', '0351-2345678', 'VEN002'),
      ('Carlos Rodríguez', 'carlos.rodriguez@sancor.com', '0351-3456789', 'VEN003'),
      ('Ana Martínez', 'ana.martinez@sancor.com', '0351-4567890', 'VEN004'),
      ('Luis Fernández', 'luis.fernandez@sancor.com', '0351-5678901', 'VEN005')
      ON CONFLICT (email) DO NOTHING;
    `;

    const { error: insertError } = await supabase.rpc('exec_sql', { sql: insertVendorsSQL });

    if (insertError) {
      console.error('❌ Error insertando vendedores:', insertError.message);
    } else {
      console.log('✅ Vendedores de ejemplo insertados');
    }

    console.log('🎉 ¡Tabla vendors creada exitosamente!');
  } catch (error) {
    console.error('❌ Error inesperado:', error.message);
  }
}

createVendorsTable();
