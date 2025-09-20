#!/bin/bash

# Script para aplicar migraciones de Supabase usando psql directamente
# Uso: ./scripts/apply-migration.sh NOMBRE_MIGRACION.sql

# Configuración de la base de datos
# Cargar configuración desde archivo config.sh si existe
if [ -f "scripts/config.sh" ]; then
    source scripts/config.sh
elif [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Verificar que las variables de entorno estén definidas
if [ -z "$PROJECT_REF" ] || [ -z "$DB_PASSWORD" ]; then
    echo "❌ Error: Las variables de entorno PROJECT_REF y DB_PASSWORD deben estar definidas"
    echo ""
    echo "Opciones para configurar:"
    echo "1. Crear archivo scripts/config.sh basado en scripts/config.example.sh"
    echo "2. Agregar variables a tu archivo .env:"
    echo "   PROJECT_REF=tu_project_ref"
    echo "   DB_PASSWORD=tu_password"
    exit 1
fi

DB_URL="postgresql://postgres.$PROJECT_REF:$DB_PASSWORD@aws-1-sa-east-1.pooler.supabase.com:6543/postgres"

# Verificar que se proporcionó el nombre del archivo
if [ $# -eq 0 ]; then
    echo "❌ Error: Debes proporcionar el nombre del archivo de migración"
    echo "Uso: $0 NOMBRE_MIGRACION.sql"
    echo "Ejemplo: $0 009_create_vendors_system.sql"
    exit 1
fi

MIGRATION_FILE="supabase/migrations/$1"

# Verificar que el archivo existe
if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Error: El archivo $MIGRATION_FILE no existe"
    exit 1
fi

echo "🚀 Aplicando migración: $1"
echo "📁 Archivo: $MIGRATION_FILE"
echo "🔗 Base de datos: aws-1-sa-east-1.pooler.supabase.com:6543"
echo ""

# Aplicar la migración
psql "$DB_URL" -f "$MIGRATION_FILE"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migración aplicada exitosamente!"
    echo "🎉 La base de datos ha sido actualizada"
else
    echo ""
    echo "❌ Error al aplicar la migración"
    exit 1
fi
