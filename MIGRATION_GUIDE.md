# Guía de Migraciones de Supabase

## 🚨 Problema Común

El comando `supabase db push` a menudo falla con errores de conectividad:

- "connection refused"
- "no route to host"
- "dial error"

## ✅ Solución que Funciona

Usar `psql` directamente para ejecutar migraciones:

```bash
psql "postgresql://postgres.$PROJECT_REF:$DB_PASSWORD@aws-1-sa-east-1.pooler.supabase.com:6543/postgres" -f supabase/migrations/NOMBRE_MIGRACION.sql
```

## 🔧 Comandos Útiles

### Aplicar una migración específica:

```bash
psql "postgresql://postgres.$PROJECT_REF:$DB_PASSWORD@aws-1-sa-east-1.pooler.supabase.com:6543/postgres" -f supabase/migrations/009_create_vendors_system.sql
```

### Verificar tablas:

```bash
psql "postgresql://postgres.$PROJECT_REF:$DB_PASSWORD@aws-1-sa-east-1.pooler.supabase.com:6543/postgres" -c "SELECT * FROM public.vendors;"
```

### Ver estructura de tabla:

```bash
psql "postgresql://postgres.$PROJECT_REF:$DB_PASSWORD@aws-1-sa-east-1.pooler.supabase.com:6543/postgres" -c "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'prefichas' AND table_schema = 'public';"
```

## 📝 Notas Importantes

- **Credenciales**: Usar variables de entorno `$DB_PASSWORD` y `$PROJECT_REF`
- **Pooler**: Usar puerto `6543` (no 5432)
- **Host**: `aws-1-sa-east-1.pooler.supabase.com`
- **Usuario**: `postgres.$PROJECT_REF`

## 🎯 Cuándo Usar Esta Solución

- Cuando `supabase db push` falle
- Para migraciones críticas
- Para verificar el estado de la DB
- Para debugging de problemas de conectividad

---

_Última actualización: 20 de septiembre de 2025_
