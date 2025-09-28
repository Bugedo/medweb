import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ContactData {
  nombre: string;
  localidad: string;
  dni: string;
  telefono: string;
  email: string;
}

export async function saveContact(data: ContactData) {
  try {
    const { data: contact, error } = await supabase
      .from('contactos')
      .insert({
        nombre: data.nombre,
        localidad: data.localidad,
        dni: data.dni,
        telefono: data.telefono,
        email: data.email,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: contact };
  } catch (error) {
    console.error('Error saving contact:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

export async function getContacts() {
  try {
    const { data: contacts, error } = await supabase
      .from('contactos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data: contacts };
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}
