import { NextRequest, NextResponse } from 'next/server';
import { saveContact } from '../../../lib/contactService';
import { checkRateLimit, getRateLimitInfo } from '../../../lib/rateLimiter';

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
    const { nombre, localidad, dni, telefono, email } = body;

    // Validar datos requeridos
    if (!nombre || !localidad || !dni || !telefono || !email) {
      return NextResponse.json(
        { success: false, error: 'Todos los campos son requeridos' },
        { status: 400 },
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Formato de email inválido' },
        { status: 400 },
      );
    }

    // Validar longitud de campos
    if (nombre.length > 100 || localidad.length > 100 || dni.length > 20 || telefono.length > 20) {
      return NextResponse.json(
        { success: false, error: 'Uno o más campos exceden la longitud máxima permitida' },
        { status: 400 },
      );
    }

    // Guardar en la base de datos
    const result = await saveContact({
      nombre: nombre.trim(),
      localidad: localidad.trim(),
      dni: dni.trim(),
      telefono: telefono.trim(),
      email: email.trim().toLowerCase(),
    });

    if (result.success) {
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
