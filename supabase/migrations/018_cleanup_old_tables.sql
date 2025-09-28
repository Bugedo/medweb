-- Migración para limpiar las tablas antiguas que ya no se usan
-- Esta migración elimina las tablas que fueron consolidadas en la tabla unificada 'prefichas'

-- 1. Eliminar las tablas antiguas que ya no se usan
DROP TABLE IF EXISTS datos_cliente_old CASCADE;
DROP TABLE IF EXISTS beneficiario_seguro_vida_old CASCADE;
DROP TABLE IF EXISTS tercero_pagador_old CASCADE;
DROP TABLE IF EXISTS informacion_adicional_old CASCADE;
DROP TABLE IF EXISTS prefichas_old CASCADE;

-- 2. Verificar que solo quede la tabla unificada
-- (Esta consulta se ejecutará para confirmar que solo existe la tabla 'prefichas')
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name LIKE '%preficha%'
ORDER BY table_name;

-- 3. Comentarios para documentación
COMMENT ON TABLE prefichas IS 'Tabla unificada que contiene todos los datos de prefichas consolidados. Reemplaza las tablas: datos_cliente, beneficiario_seguro_vida, tercero_pagador, informacion_adicional';
