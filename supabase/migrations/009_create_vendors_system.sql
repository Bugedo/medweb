-- Crear tabla de vendedores
CREATE TABLE IF NOT EXISTS public.vendors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    code VARCHAR(50) UNIQUE NOT NULL, -- Código único del vendedor
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Agregar columna vendor_id a la tabla prefichas
ALTER TABLE public.prefichas 
ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES public.vendors(id);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_vendors_email ON public.vendors(email);
CREATE INDEX IF NOT EXISTS idx_vendors_code ON public.vendors(code);
CREATE INDEX IF NOT EXISTS idx_vendors_active ON public.vendors(is_active);
CREATE INDEX IF NOT EXISTS idx_prefichas_vendor_id ON public.prefichas(vendor_id);

-- Habilitar RLS en la tabla vendors
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para vendors
-- Los administradores pueden ver todos los vendedores
CREATE POLICY "Admins can view all vendors"
ON public.vendors FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
);

-- Los administradores pueden insertar vendedores
CREATE POLICY "Admins can insert vendors"
ON public.vendors FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
);

-- Los administradores pueden actualizar vendedores
CREATE POLICY "Admins can update vendors"
ON public.vendors FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
);

-- Los administradores pueden eliminar vendedores
CREATE POLICY "Admins can delete vendors"
ON public.vendors FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en vendors
CREATE TRIGGER update_vendors_updated_at 
    BEFORE UPDATE ON public.vendors 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar algunos vendedores de ejemplo
INSERT INTO public.vendors (name, email, phone, code) VALUES
('Juan Pérez', 'juan.perez@sancor.com', '0351-1234567', 'VEN001'),
('María González', 'maria.gonzalez@sancor.com', '0351-2345678', 'VEN002'),
('Carlos Rodríguez', 'carlos.rodriguez@sancor.com', '0351-3456789', 'VEN003'),
('Ana Martínez', 'ana.martinez@sancor.com', '0351-4567890', 'VEN004'),
('Luis Fernández', 'luis.fernandez@sancor.com', '0351-5678901', 'VEN005')
ON CONFLICT (email) DO NOTHING;
