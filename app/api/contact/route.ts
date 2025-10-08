import { NextRequest, NextResponse } from 'next/server';
import { saveContact } from '../../../lib/contactService';
import { checkRateLimit, getRateLimitInfo } from '../../../lib/rateLimiter';
import { appendContactToSheet } from '../../../lib/googleSheetsService';

export async function POST(request: NextRequest) {
  try {
    // Obtener IP del cliente
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      'unknown';

    // Verificar rate limit (100 requests por minuto para desarrollo)
    if (!checkRateLimit(ip, 100, 60000)) {
      const rateLimitInfo = getRateLimitInfo(ip);
      return NextResponse.json(
        {
          success: false,
          error: 'Demasiadas solicitudes. Intenta nuevamente en un momento.',
          rateLimitInfo,
        },
        { status: 429 },
      );
    }

    // Parsear datos del formulario
    const body = await request.json();
    const { nombre, localidad, telefono, email, observaciones } = body;

    // Validar datos requeridos
    if (!nombre || !localidad || !telefono) {
      return NextResponse.json(
        { success: false, error: 'Los campos nombre, localidad y teléfono son requeridos' },
        { status: 400 },
      );
    }

    // Validar formato de email si se proporciona
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { success: false, error: 'Formato de email inválido' },
          { status: 400 },
        );
      }
    }

    // Validar longitud de campos
    if (nombre.length > 100 || localidad.length > 100 || telefono.length > 20) {
      return NextResponse.json(
        { success: false, error: 'Uno o más campos exceden la longitud máxima permitida' },
        { status: 400 },
      );
    }

    if (observaciones && observaciones.length > 500) {
      return NextResponse.json(
        { success: false, error: 'Las observaciones no pueden exceder 500 caracteres' },
        { status: 400 },
      );
    }

    // Preparar datos del contacto
    const contactData = {
      nombre: nombre.trim(),
      localidad: localidad.trim(),
      telefono: telefono.trim(),
      email: email ? email.trim().toLowerCase() : '',
      observaciones: observaciones ? observaciones.trim() : '',
    };

    // Guardar en la base de datos
    const result = await saveContact({
      ...contactData,
      email: contactData.email || null,
      observaciones: contactData.observaciones || null,
    });

    if (result.success) {
      // También guardar en Google Sheets
      try {
        await appendContactToSheet(contactData);
        console.log('✅ Contact saved to both DB and Google Sheets');
      } catch (sheetError: any) {
        console.error('❌ ERROR GOOGLE SHEETS:', sheetError);
        console.error('❌ ERROR MESSAGE:', sheetError.message);
        console.error('❌ ERROR STACK:', sheetError.stack);
        // No bloqueamos la respuesta si falla Google Sheets
      }

      return NextResponse.json({
        success: true,
        message: '¡Gracias! Nos pondremos en contacto contigo pronto.',
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Error al guardar el formulario' },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error en API contact:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
