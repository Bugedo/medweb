-- Migración para unificar todas las tablas de prefichas en una sola tabla
-- Esta migración consolidará todos los datos de prefichas en una tabla unificada

-- 1. Crear nueva tabla unificada con todas las columnas
CREATE TABLE prefichas_unified (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    vendor_id UUID REFERENCES vendors(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    
    -- Datos del cliente (de datos_cliente)
    vendedor TEXT,
    nombre_cliente TEXT,
    apellido_cliente TEXT,
    email TEXT,
    dni TEXT,
    numero_celular TEXT,
    vigencia_cobertura DATE,
    
    -- Beneficiario del seguro de vida (de beneficiario_seguro_vida)
    beneficiario_apellido_nombres TEXT,
    beneficiario_dni TEXT,
    beneficiario_fecha_nacimiento DATE,
    
    -- Tercero pagador (de tercero_pagador)
    tercero_apellido_nombres TEXT,
    tercero_email TEXT,
    tercero_numero_celular TEXT,
    
    -- Información adicional (de informacion_adicional)
    origen_dato TEXT[],
    canal_afiliacion TEXT[],
    plan TEXT,
    precio_lista TEXT,
    porcentaje_descuento TEXT,
    cantidad_capitas TEXT,
    localidad_provincia TEXT,
    observaciones TEXT,
    archivo_adjunto TEXT
);

-- 2. Migrar datos existentes de todas las tablas relacionadas
INSERT INTO prefichas_unified (
    id,
    created_at,
    updated_at,
    vendor_id,
    status,
    vendedor,
    nombre_cliente,
    apellido_cliente,
    email,
    dni,
    numero_celular,
    vigencia_cobertura,
    beneficiario_apellido_nombres,
    beneficiario_dni,
    beneficiario_fecha_nacimiento,
    tercero_apellido_nombres,
    tercero_email,
    tercero_numero_celular,
    origen_dato,
    canal_afiliacion,
    plan,
    precio_lista,
    porcentaje_descuento,
    cantidad_capitas,
    localidad_provincia,
    observaciones,
    archivo_adjunto
)
SELECT 
    p.id,
    p.created_at,
    p.updated_at,
    p.vendor_id,
    COALESCE(p.status, 'pending'),
    dc.vendedor,
    dc.nombre_cliente,
    dc.apellido_cliente,
    dc.email,
    dc.dni,
    dc.numero_celular,
    dc.vigencia_cobertura,
    bsv.apellido_nombres,
    bsv.dni,
    bsv.fecha_nacimiento,
    tp.apellido_nombres,
    tp.email,
    tp.numero_celular,
    ia.origen_dato,
    ia.canal_afiliacion,
    ia.plan,
    ia.precio_lista,
    ia.porcentaje_descuento,
    ia.cantidad_capitas,
    ia.localidad_provincia,
    ia.observaciones,
    ia.archivo_adjunto
FROM prefichas p
LEFT JOIN datos_cliente dc ON p.id = dc.preficha_id
LEFT JOIN beneficiario_seguro_vida bsv ON p.id = bsv.preficha_id
LEFT JOIN tercero_pagador tp ON p.id = tp.preficha_id
LEFT JOIN informacion_adicional ia ON p.id = ia.preficha_id;

-- 3. Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_prefichas_unified_status ON prefichas_unified(status);
CREATE INDEX IF NOT EXISTS idx_prefichas_unified_vendor ON prefichas_unified(vendor_id);
CREATE INDEX IF NOT EXISTS idx_prefichas_unified_email ON prefichas_unified(email);
CREATE INDEX IF NOT EXISTS idx_prefichas_unified_created_at ON prefichas_unified(created_at);

-- 4. Renombrar tablas para mantener backup
ALTER TABLE prefichas RENAME TO prefichas_old;
ALTER TABLE datos_cliente RENAME TO datos_cliente_old;
ALTER TABLE beneficiario_seguro_vida RENAME TO beneficiario_seguro_vida_old;
ALTER TABLE tercero_pagador RENAME TO tercero_pagador_old;
ALTER TABLE informacion_adicional RENAME TO informacion_adicional_old;

-- 5. Renombrar la nueva tabla como la principal
ALTER TABLE prefichas_unified RENAME TO prefichas;

-- 6. Actualizar RLS policies para la nueva tabla
-- (Esto se hará en una migración separada si es necesario)

-- 7. Comentarios para documentación
COMMENT ON TABLE prefichas IS 'Tabla unificada que contiene todos los datos de prefichas consolidados';
COMMENT ON COLUMN prefichas.vendedor IS 'Nombre del vendedor (puede ser temporal o de la tabla vendors)';
COMMENT ON COLUMN prefichas.status IS 'Estado de la preficha: pending o completed';
