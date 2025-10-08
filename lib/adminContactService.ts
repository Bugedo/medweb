import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Contacto {
  id: string;
  nombre: string;
  localidad: string;
  dni: string;
  telefono: string;
  email: string;
  status: 'pending' | 'contacted' | 'closed' | 'not_interested';
  created_at: string;
  updated_at: string;
}

export interface ContactosResponse {
  success: boolean;
  data?: Contacto[];
  error?: string;
  total?: number;
}

export interface UpdateStatusResponse {
  success: boolean;
  error?: string;
}

export async function getContactos(
  page: number = 1,
  limit: number = 15,
  search: string = '',
  status: string = 'all'
): Promise<ContactosResponse> {
  try {
    // Query para obtener todos los leads que coincidan con los filtros
    let query = supabase
      .from('contactos')
      .select('*', { count: 'exact' });

    // Aplicar filtro de búsqueda
    if (search) {
      query = query.or(`nombre.ilike.%${search}%,email.ilike.%${search}%,telefono.ilike.%${search}%,localidad.ilike.%${search}%`);
    }

    // Aplicar filtro de status
    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    // Ordenamiento personalizado: primero pendientes (más nuevo→más viejo), luego el resto (más nuevo→más viejo)
    const sortedData = (data || []).sort((a, b) => {
      // Primero ordenar por prioridad de status (pendientes primero)
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      
      // Dentro del mismo tipo de status, ordenar por fecha (más nuevo primero)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    // Aplicar paginación manualmente después del ordenamiento
    const from = (page - 1) * limit;
    const to = from + limit;
    const paginatedData = sortedData.slice(from, to);

    return {
      success: true,
      data: paginatedData,
      total: count || 0,
    };
  } catch (error) {
    console.error('Error fetching contactos:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

export async function updateContactoStatus(
  id: string,
  status: 'pending' | 'contacted' | 'closed' | 'not_interested'
): Promise<UpdateStatusResponse> {
  try {
    const { error } = await supabase
      .from('contactos')
      .update({ status })
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error updating contacto status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

export async function deleteContacto(id: string): Promise<UpdateStatusResponse> {
  try {
    const { error } = await supabase
      .from('contactos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error deleting contacto:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}
