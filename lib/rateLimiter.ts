// Rate limiter simple en memoria
// En producción, usar Redis o similar para múltiples instancias

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  ip: string,
  maxRequests: number = 100, // Aumentado para desarrollo
  windowMs: number = 60000,
): boolean {
  const now = Date.now();
  const key = ip;

  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // Primera request o ventana expirada
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true; // Permitir
  }

  if (entry.count >= maxRequests) {
    return false; // Bloquear
  }

  // Incrementar contador
  entry.count++;
  return true; // Permitir
}

export function getRateLimitInfo(ip: string): { remaining: number; resetTime: number } | null {
  const entry = rateLimitStore.get(ip);

  if (!entry) {
    return { remaining: 100, resetTime: Date.now() + 60000 }; // Aumentado para desarrollo
  }

  const now = Date.now();
  if (now > entry.resetTime) {
    return { remaining: 100, resetTime: now + 60000 }; // Aumentado para desarrollo
  }

  return {
    remaining: Math.max(0, 100 - entry.count), // Aumentado para desarrollo
    resetTime: entry.resetTime,
  };
}

// Limpiar entradas expiradas cada 5 minutos
setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now > entry.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  },
  5 * 60 * 1000,
);
