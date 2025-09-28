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

// Datos de prueba para prefichas
const prefichasData = [
  {
    vendedor: 'María González',
    nombre_cliente: 'Carlos',
    apellido_cliente: 'Rodríguez',
    email: 'carlos.rodriguez@email.com',
    numero_celular: '+54 11 1234-5678',
    vigencia_cobertura: '2024-12-31',
    plan: 'Plan Familiar Premium',
    precio_lista: '$45,000',
    localidad_provincia: 'Buenos Aires, CABA',
    origen_dato: ['Web', 'Redes Sociales'],
    canal_afiliacion: ['Online'],
    porcentaje_descuento: '10%',
    cantidad_capitas: '4',
  },
  {
    vendedor: 'Juan Pérez',
    nombre_cliente: 'Ana',
    apellido_cliente: 'Martínez',
    email: 'ana.martinez@email.com',
    numero_celular: '+54 11 2345-6789',
    vigencia_cobertura: '2024-12-31',
    plan: 'Plan Individual Estándar',
    precio_lista: '$25,000',
    localidad_provincia: 'Córdoba, Córdoba',
    origen_dato: ['Referido'],
    canal_afiliacion: ['Presencial'],
    porcentaje_descuento: '5%',
    cantidad_capitas: '1',
  },
  {
    vendedor: 'Laura Fernández',
    nombre_cliente: 'Roberto',
    apellido_cliente: 'Silva',
    email: 'roberto.silva@email.com',
    numero_celular: '+54 11 3456-7890',
    vigencia_cobertura: '2024-12-31',
    plan: 'Plan Empresarial',
    precio_lista: '$65,000',
    localidad_provincia: 'Rosario, Santa Fe',
    origen_dato: ['Web'],
    canal_afiliacion: ['Online'],
    porcentaje_descuento: '15%',
    cantidad_capitas: '20',
  },
  {
    vendedor: 'Diego López',
    nombre_cliente: 'Patricia',
    apellido_cliente: 'García',
    email: 'patricia.garcia@email.com',
    numero_celular: '+54 11 4567-8901',
    vigencia_cobertura: '2024-12-31',
    plan: 'Plan Senior Plus',
    precio_lista: '$35,000',
    localidad_provincia: 'Mendoza, Mendoza',
    origen_dato: ['Telefónico'],
    canal_afiliacion: ['Presencial'],
    porcentaje_descuento: '8%',
    cantidad_capitas: '2',
  },
  {
    vendedor: 'Sofía Herrera',
    nombre_cliente: 'Miguel',
    apellido_cliente: 'Torres',
    email: 'miguel.torres@email.com',
    numero_celular: '+54 11 5678-9012',
    vigencia_cobertura: '2024-12-31',
    plan: 'Plan Joven',
    precio_lista: '$18,000',
    localidad_provincia: 'La Plata, Buenos Aires',
    origen_dato: ['Web'],
    canal_afiliacion: ['Online'],
    porcentaje_descuento: '12%',
    cantidad_capitas: '1',
  },
];

// Datos de prueba para contactos
const contactosData = [
  {
    nombre: 'Elena Vargas',
    localidad: 'San Miguel de Tucumán, Tucumán',
    dni: '12345678',
    telefono: '+54 381 123-4567',
    email: 'elena.vargas@email.com',
    status: 'pending',
  },
  {
    nombre: 'Fernando Ruiz',
    localidad: 'Mar del Plata, Buenos Aires',
    dni: '23456789',
    telefono: '+54 223 234-5678',
    email: 'fernando.ruiz@email.com',
    status: 'contacted',
  },
  {
    nombre: 'Isabel Morales',
    localidad: 'Salta, Salta',
    dni: '34567890',
    telefono: '+54 387 345-6789',
    email: 'isabel.morales@email.com',
    status: 'closed',
  },
  {
    nombre: 'Gustavo Herrera',
    localidad: 'Neuquén, Neuquén',
    dni: '45678901',
    telefono: '+54 299 456-7890',
    email: 'gustavo.herrera@email.com',
    status: 'not_interested',
  },
  {
    nombre: 'Carmen Jiménez',
    localidad: 'Bahía Blanca, Buenos Aires',
    dni: '56789012',
    telefono: '+54 291 567-8901',
    email: 'carmen.jimenez@email.com',
    status: 'pending',
  },
  {
    nombre: 'Ricardo Castro',
    localidad: 'Paraná, Entre Ríos',
    dni: '67890123',
    telefono: '+54 343 678-9012',
    email: 'ricardo.castro@email.com',
    status: 'contacted',
  },
  {
    nombre: 'Valeria Sánchez',
    localidad: 'Comodoro Rivadavia, Chubut',
    dni: '78901234',
    telefono: '+54 297 789-0123',
    email: 'valeria.sanchez@email.com',
    status: 'pending',
  },
  {
    nombre: 'Oscar Mendoza',
    localidad: 'Resistencia, Chaco',
    dni: '89012345',
    telefono: '+54 362 890-1234',
    email: 'oscar.mendoza@email.com',
    status: 'closed',
  },
  {
    nombre: 'Natalia Romero',
    localidad: 'Corrientes, Corrientes',
    dni: '90123456',
    telefono: '+54 379 901-2345',
    email: 'natalia.romero@email.com',
    status: 'contacted',
  },
  {
    nombre: 'Héctor Vega',
    localidad: 'Posadas, Misiones',
    dni: '01234567',
    telefono: '+54 376 012-3456',
    email: 'hector.vega@email.com',
    status: 'not_interested',
  },
];

async function seedDatabase() {
  console.log('🌱 Iniciando seed de la base de datos...');

  try {
    // 1. Limpiar datos existentes
    console.log('🧹 Limpiando datos existentes...');

    await supabase.from('contactos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('prefichas').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('✅ Datos existentes eliminados');

    // 2. Insertar prefichas
    console.log('📋 Insertando prefichas...');
    const prefichas = [];

    for (const prefichaData of prefichasData) {
      // Crear la preficha principal
      const { data: preficha, error: prefichaError } = await supabase
        .from('prefichas')
        .insert({})
        .select()
        .single();

      if (prefichaError) throw prefichaError;

      // Insertar datos del cliente
      const { error: clienteError } = await supabase.from('datos_cliente').insert({
        preficha_id: preficha.id,
        vendedor: prefichaData.vendedor,
        nombre_cliente: prefichaData.nombre_cliente,
        apellido_cliente: prefichaData.apellido_cliente,
        email: prefichaData.email,
        numero_celular: prefichaData.numero_celular,
        vigencia_cobertura: prefichaData.vigencia_cobertura,
      });

      if (clienteError) throw clienteError;

      // Insertar información adicional
      const { error: infoError } = await supabase.from('informacion_adicional').insert({
        preficha_id: preficha.id,
        origen_dato: prefichaData.origen_dato,
        canal_afiliacion: prefichaData.canal_afiliacion,
        plan: prefichaData.plan,
        precio_lista: prefichaData.precio_lista,
        porcentaje_descuento: prefichaData.porcentaje_descuento,
        cantidad_capitas: prefichaData.cantidad_capitas,
        localidad_provincia: prefichaData.localidad_provincia,
      });

      if (infoError) throw infoError;

      prefichas.push(preficha);
    }

    console.log(`✅ ${prefichas.length} prefichas insertadas`);

    // 3. Insertar contactos
    console.log('📞 Insertando contactos...');
    const { data: contactos, error: contactosError } = await supabase
      .from('contactos')
      .insert(contactosData)
      .select();

    if (contactosError) {
      throw contactosError;
    }

    console.log(`✅ ${contactos.length} contactos insertados`);

    // 4. Mostrar resumen
    console.log('\n📊 Resumen del seed:');
    console.log(`📋 Prefichas: ${prefichas.length}`);
    console.log(`📞 Contactos: ${contactos.length}`);

    // Mostrar distribución de estados de contactos
    const statusCount = contactosData.reduce((acc, contacto) => {
      acc[contacto.status] = (acc[contacto.status] || 0) + 1;
      return acc;
    }, {});

    console.log('\n📈 Distribución de estados de contactos:');
    Object.entries(statusCount).forEach(([status, count]) => {
      const labels = {
        pending: 'Pendiente',
        contacted: 'Contactado',
        closed: 'Cliente Cerrado',
        not_interested: 'No Interesado',
      };
      console.log(`  ${labels[status]}: ${count}`);
    });

    console.log('\n🎉 Seed completado exitosamente!');
    console.log('💡 Ahora puedes probar el panel de admin con datos reales');
  } catch (error) {
    console.error('❌ Error durante el seed:', error.message);
    process.exit(1);
  }
}

// Ejecutar el seed
seedDatabase();
