-- Agregar columna status a la tabla contactos
ALTER TABLE contactos 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'closed', 'not_interested'));

-- Crear índice para mejorar performance en filtros por status
CREATE INDEX IF NOT EXISTS idx_contactos_status ON contactos(status);

-- Agregar columna de fecha de actualización
ALTER TABLE contactos 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_contactos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_contactos_updated_at_trigger ON contactos;
CREATE TRIGGER update_contactos_updated_at_trigger
    BEFORE UPDATE ON contactos
    FOR EACH ROW
    EXECUTE FUNCTION update_contactos_updated_at();
