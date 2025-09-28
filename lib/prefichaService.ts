import { supabase } from './supabaseClient';

export interface PrefichaData {
  // Datos del Cliente
  vendedor: string;
  nombreCliente: string;
  apellidoCliente: string;
  email: string;
  dni?: string;
  numeroCelular: string;
  vigenciaCobertura: string;

  // Beneficiario del Seguro de Vida
  beneficiarioApellidoNombres?: string;
  beneficiarioDni?: string;
  beneficiarioFechaNacimiento?: string;

  // Datos del Tercero Pagador
  terceroApellidoNombres?: string;
  terceroEmail?: string;
  terceroNumeroCelular?: string;

  // Información adicional
  origenDato: string[];
  canalAfiliacion: string[];
  plan: string;
  precioLista: string;
  porcentajeDescuento: string;
  cantidadCapitas?: string;
  localidadProvincia: string;
  observaciones?: string;
  archivoAdjunto?: File | null;
}

export async function savePreficha(data: PrefichaData) {
  try {
    // Si es un vendedor temporal, guardar el nombre en lugar del ID
    let vendedorName = data.vendedor;
    let vendorId = null;

    if (data.vendedor.startsWith('temp-')) {
      const tempVendors = [
        { id: 'temp-1', name: 'Juan Pérez' },
        { id: 'temp-2', name: 'María González' },
        { id: 'temp-3', name: 'Carlos Rodríguez' },
        { id: 'temp-4', name: 'Ana Martínez' },
        { id: 'temp-5', name: 'Luis Fernández' },
      ];
      const vendor = tempVendors.find((v) => v.id === data.vendedor);
      vendedorName = vendor ? vendor.name : data.vendedor;
    } else {
      vendorId = data.vendedor;
    }

    // Subir archivo si existe
    let archivoPath: string | null = null;
    if (data.archivoAdjunto) {
      const fileExt = data.archivoAdjunto.name.split('.').pop();
      const fileName = `preficha-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('preficha-files')
        .upload(fileName, data.archivoAdjunto);

      if (uploadError) throw uploadError;

      archivoPath = fileName;
    }

    // Insertar todos los datos en una sola tabla unificada
    const { data: preficha, error: prefichaError } = await supabase
      .from('prefichas')
      .insert({
        vendor_id: vendorId,
        status: 'pending',

        // Datos del cliente
        vendedor: vendedorName,
        nombre_cliente: data.nombreCliente,
        apellido_cliente: data.apellidoCliente,
        email: data.email,
        dni: data.dni,
        numero_celular: data.numeroCelular,
        vigencia_cobertura: data.vigenciaCobertura,

        // Beneficiario del seguro de vida
        beneficiario_apellido_nombres: data.beneficiarioApellidoNombres,
        beneficiario_dni: data.beneficiarioDni,
        beneficiario_fecha_nacimiento: data.beneficiarioFechaNacimiento,

        // Tercero pagador
        tercero_apellido_nombres: data.terceroApellidoNombres,
        tercero_email: data.terceroEmail,
        tercero_numero_celular: data.terceroNumeroCelular,

        // Información adicional
        origen_dato: data.origenDato,
        canal_afiliacion: data.canalAfiliacion,
        plan: data.plan,
        precio_lista: data.precioLista,
        porcentaje_descuento: data.porcentajeDescuento,
        cantidad_capitas: data.cantidadCapitas,
        localidad_provincia: data.localidadProvincia,
        observaciones: data.observaciones,
        archivo_adjunto: archivoPath,
      })
      .select()
      .single();

    if (prefichaError) throw prefichaError;

    return { success: true, prefichaId: preficha.id };
  } catch (error: any) {
    console.error('Error saving preficha:', error);
    return { success: false, error: error.message };
  }
}

export async function getPrefichas() {
  try {
    const { data, error } = await supabase
      .from('prefichas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error('Error fetching prefichas:', error);
    return { success: false, error: error.message };
  }
}
