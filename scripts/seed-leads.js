const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Usando service role key para bypasear RLS

const supabase = createClient(supabaseUrl, supabaseKey);

const nombres = [
  'Juan Pérez',
  'María González',
  'Carlos Rodríguez',
  'Ana Martínez',
  'Luis Fernández',
  'Laura García',
  'Pedro López',
  'Carmen Sánchez',
  'José Romero',
  'Isabel Torres',
  'Miguel Ramírez',
  'Sofía Flores',
  'Diego Morales',
  'Valentina Castro',
  'Mateo Silva',
  'Lucía Ortiz',
  'Santiago Ruiz',
  'Martina Díaz',
  'Sebastián Herrera',
  'Camila Vargas',
  'Nicolás Medina',
  'Emma Reyes',
  'Benjamín Cruz',
  'Olivia Jiménez',
  'Lucas Mendoza',
  'Mía Gutiérrez',
  'Gabriel Rojas',
  'Isabella Aguilar',
  'Joaquín Navarro',
  'Victoria Molina',
  'Tomás Cabrera',
  'Emilia Carrillo',
  'Daniel Ríos',
  'Catalina Domínguez',
  'Felipe Vega',
  'Julieta Álvarez',
  'Ignacio Campos',
  'Delfina Ramos',
  'Facundo Luna',
  'Renata Muñoz',
  'Bautista Peña',
  'Miranda Sosa',
  'Agustín Cortés',
  'Francesca Ibáñez',
  'Lorenzo Gil',
  'Allegra Vera',
  'Bruno Fuentes',
  'Bianca Guerrero',
  'Gael Moreno',
  'Ariana Valdés',
];

const localidades = [
  'Buenos Aires',
  'Córdoba',
  'Rosario',
  'Mendoza',
  'La Plata',
  'San Miguel de Tucumán',
  'Mar del Plata',
  'Salta',
  'Santa Fe',
  'San Juan',
  'Resistencia',
  'Neuquén',
  'Posadas',
  'Santiago del Estero',
  'Corrientes',
  'Bahía Blanca',
  'Paraná',
  'San Salvador de Jujuy',
  'Formosa',
  'La Rioja',
  'Catamarca',
  'San Luis',
  'Río Cuarto',
  'Comodoro Rivadavia',
  'Concordia',
];

const statuses = ['pending', 'contacted', 'closed', 'not_interested'];

// Generar 50 leads
const leads = [];
for (let i = 0; i < 50; i++) {
  const createdAt = new Date();
  // Variar las fechas para tener leads de diferentes momentos
  createdAt.setHours(createdAt.getHours() - Math.floor(Math.random() * 720)); // Últimos 30 días

  // Mayoría pendientes para probar el ordenamiento
  const statusWeights = [0.6, 0.2, 0.1, 0.1]; // 60% pending, 20% contacted, 10% closed, 10% not_interested
  const rand = Math.random();
  let status = 'pending';
  let cumulative = 0;
  for (let j = 0; j < statusWeights.length; j++) {
    cumulative += statusWeights[j];
    if (rand < cumulative) {
      status = statuses[j];
      break;
    }
  }

  leads.push({
    nombre: nombres[i % nombres.length],
    localidad: localidades[Math.floor(Math.random() * localidades.length)],
    telefono: `11${Math.floor(10000000 + Math.random() * 90000000)}`,
    email: `lead${i + 1}@test.com`,
    dni: null,
    observaciones: i % 5 === 0 ? `Lead de prueba #${i + 1} - Interesado en plan familiar` : null,
    status: status,
    created_at: createdAt.toISOString(),
  });
}

async function seedLeads() {
  try {
    console.log('🌱 Insertando 50 leads de prueba...');

    const { data, error } = await supabase.from('contactos').insert(leads).select();

    if (error) throw error;

    console.log(`✅ ${data.length} leads insertados exitosamente!`);
    console.log('\nDistribución de estados:');

    const statusCount = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});

    Object.entries(statusCount).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedLeads();
