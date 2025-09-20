#!/bin/bash

# Archivo de configuración de ejemplo para scripts de migración
# Copia este archivo a config.sh y rellena con tus datos reales

# Configuración de Supabase
export PROJECT_REF="YOUR_PROJECT_REF"
export DB_PASSWORD="YOUR_DB_PASSWORD"

# URL de conexión a la base de datos
export DB_URL="postgresql://postgres.$PROJECT_REF:$DB_PASSWORD@aws-1-sa-east-1.pooler.supabase.com:6543/postgres"

echo "✅ Configuración cargada para proyecto: $PROJECT_REF"
