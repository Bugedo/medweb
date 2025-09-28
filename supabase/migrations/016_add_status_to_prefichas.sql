-- Agregar columna status a la tabla prefichas
ALTER TABLE prefichas 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed'));

-- Crear índice para mejorar performance en filtros por status
CREATE INDEX IF NOT EXISTS idx_prefichas_status ON prefichas(status);

-- Actualizar prefichas existentes para que tengan status 'pending' por defecto
UPDATE prefichas SET status = 'pending' WHERE status IS NULL;