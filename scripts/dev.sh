#!/bin/bash

# Script de desarrollo optimizado para Next.js
echo "🚀 Iniciando servidor de desarrollo optimizado..."

# Limpiar cache si existe
if [ -d ".next" ]; then
    echo "🧹 Limpiando cache..."
    rm -rf .next
fi

# Limpiar node_modules si hay problemas
if [ "$1" = "--clean" ]; then
    echo "🧹 Limpiando node_modules..."
    rm -rf node_modules
    npm install
fi

# Verificar que el puerto 3000 esté libre
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Puerto 3000 en uso. Terminando procesos..."
    pkill -f "next.*dev" || true
    pkill -f "node.*3000" || true
    sleep 2
fi

# Iniciar servidor con configuración optimizada
echo "🔥 Iniciando servidor con Turbo..."
NODE_ENV=development NEXT_TELEMETRY_DISABLED=1 next dev --turbo --port 3000
