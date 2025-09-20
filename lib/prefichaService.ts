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
    // 1. Crear la preficha principal con vendor_id (si no es temporal)
    const insertData: any = {};
    if (!data.vendedor.startsWith('temp-')) {
      insertData.vendor_id = data.vendedor;
    }

    const { data: preficha, error: prefichaError } = await supabase
      .from('prefichas')
      .insert(insertData)
      .select()
      .single();

    if (prefichaError) throw prefichaError;

    // 2. Guardar datos del cliente
    // Si es un vendedor temporal, guardar el nombre en lugar del ID
    let vendedorName = data.vendedor;
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
    }

    const { error: clienteError } = await supabase.from('datos_cliente').insert({
      preficha_id: preficha.id,
      vendedor: vendedorName,
      nombre_cliente: data.nombreCliente,
      apellido_cliente: data.apellidoCliente,
      email: data.email,
      dni: data.dni,
      numero_celular: data.numeroCelular,
      vigencia_cobertura: data.vigenciaCobertura,
    });

    if (clienteError) throw clienteError;

    // 3. Guardar beneficiario del seguro de vida (si existe)
    if (
      data.beneficiarioApellidoNombres ||
      data.beneficiarioDni ||
      data.beneficiarioFechaNacimiento
    ) {
      const { error: beneficiarioError } = await supabase.from('beneficiario_seguro_vida').insert({
        preficha_id: preficha.id,
        apellido_nombres: data.beneficiarioApellidoNombres,
        dni: data.beneficiarioDni,
        fecha_nacimiento: data.beneficiarioFechaNacimiento,
      });

      if (beneficiarioError) throw beneficiarioError;
    }

    // 4. Guardar tercero pagador (si existe)
    if (data.terceroApellidoNombres || data.terceroEmail || data.terceroNumeroCelular) {
      const { error: terceroError } = await supabase.from('tercero_pagador').insert({
        preficha_id: preficha.id,
        apellido_nombres: data.terceroApellidoNombres,
        email: data.terceroEmail,
        numero_celular: data.terceroNumeroCelular,
      });

      if (terceroError) throw terceroError;
    }

    // 5. Subir archivo si existe
    let archivoPath: string | null = null;
    if (data.archivoAdjunto) {
      const fileExt = data.archivoAdjunto.name.split('.').pop();
      const fileName = `${preficha.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('preficha-files')
        .upload(fileName, data.archivoAdjunto);

      if (uploadError) throw uploadError;

      archivoPath = fileName;
    }

    // 6. Guardar información adicional
    const { error: infoError } = await supabase.from('informacion_adicional').insert({
      preficha_id: preficha.id,
      origen_dato: data.origenDato,
      canal_afiliacion: data.canalAfiliacion,
      plan: data.plan,
      precio_lista: data.precioLista,
      porcentaje_descuento: data.porcentajeDescuento,
      cantidad_capitas: data.cantidadCapitas,
      localidad_provincia: data.localidadProvincia,
      observaciones: data.observaciones,
      archivo_adjunto: archivoPath,
    });

    if (infoError) throw infoError;

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
      .select(
        `
        *,
        vendors(name, code),
        datos_cliente(*),
        beneficiario_seguro_vida(*),
        tercero_pagador(*),
        informacion_adicional(*)
      `,
      )
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error('Error fetching prefichas:', error);
    return { success: false, error: error.message };
  }
}
