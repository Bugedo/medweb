-- Crear tabla principal de prefichas
CREATE TABLE prefichas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para datos del cliente
CREATE TABLE datos_cliente (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    preficha_id UUID REFERENCES prefichas(id) ON DELETE CASCADE,
    vendedor TEXT NOT NULL,
    nombre_cliente TEXT NOT NULL,
    apellido_cliente TEXT NOT NULL,
    email TEXT NOT NULL,
    dni TEXT,
    numero_celular TEXT NOT NULL,
    vigencia_cobertura DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para beneficiario del seguro de vida
CREATE TABLE beneficiario_seguro_vida (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    preficha_id UUID REFERENCES prefichas(id) ON DELETE CASCADE,
    apellido_nombres TEXT,
    dni TEXT,
    fecha_nacimiento DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para datos del tercero pagador
CREATE TABLE tercero_pagador (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    preficha_id UUID REFERENCES prefichas(id) ON DELETE CASCADE,
    apellido_nombres TEXT,
    email TEXT,
    numero_celular TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para información adicional
CREATE TABLE informacion_adicional (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    preficha_id UUID REFERENCES prefichas(id) ON DELETE CASCADE,
    origen_dato TEXT[], -- Array para múltiples checkboxes
    canal_afiliacion TEXT[], -- Array para múltiples checkboxes
    plan TEXT NOT NULL,
    precio_lista TEXT NOT NULL,
    porcentaje_descuento TEXT NOT NULL,
    cantidad_capitas TEXT,
    localidad_provincia TEXT NOT NULL,
    observaciones TEXT,
    archivo_adjunto TEXT, -- Ruta del archivo subido
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar performance
CREATE INDEX idx_datos_cliente_preficha_id ON datos_cliente(preficha_id);
CREATE INDEX idx_beneficiario_preficha_id ON beneficiario_seguro_vida(preficha_id);
CREATE INDEX idx_tercero_pagador_preficha_id ON tercero_pagador(preficha_id);
CREATE INDEX idx_info_adicional_preficha_id ON informacion_adicional(preficha_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE prefichas ENABLE ROW LEVEL SECURITY;
ALTER TABLE datos_cliente ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiario_seguro_vida ENABLE ROW LEVEL SECURITY;
ALTER TABLE tercero_pagador ENABLE ROW LEVEL SECURITY;
ALTER TABLE informacion_adicional ENABLE ROW LEVEL SECURITY;

-- Crear políticas básicas (permitir todo por ahora, se pueden ajustar después)
CREATE POLICY "Allow all operations on prefichas" ON prefichas FOR ALL USING (true);
CREATE POLICY "Allow all operations on datos_cliente" ON datos_cliente FOR ALL USING (true);
CREATE POLICY "Allow all operations on beneficiario_seguro_vida" ON beneficiario_seguro_vida FOR ALL USING (true);
CREATE POLICY "Allow all operations on tercero_pagador" ON tercero_pagador FOR ALL USING (true);
CREATE POLICY "Allow all operations on informacion_adicional" ON informacion_adicional FOR ALL USING (true);
