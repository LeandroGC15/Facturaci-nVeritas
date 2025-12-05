#!/bin/bash

# Script de despliegue para Veritas Frontend
# Uso: ./deploy.sh usuario@209.126.11.198

set -e  # Salir si hay algún error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar que se proporcionó el host
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Debes proporcionar el host del VPS${NC}"
    echo "Uso: ./deploy.sh usuario@209.126.11.198"
    exit 1
fi

VPS_HOST=$1
VPS_PATH="/var/www/veritasfront"

echo -e "${GREEN}🚀 Iniciando despliegue de Veritas Frontend${NC}"
echo "Host: $VPS_HOST"
echo ""

# Paso 1: Verificar que existe .env
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Advertencia: No se encontró archivo .env${NC}"
    echo "Asegúrate de tener configurado VITE_API_BASE_URL para producción"
    read -p "¿Continuar de todas formas? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Paso 2: Build del proyecto
echo -e "${GREEN}📦 Construyendo proyecto...${NC}"
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Error: No se generó la carpeta dist/${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completado${NC}"
echo ""

# Paso 3: Subir archivos al VPS
echo -e "${GREEN}📤 Subiendo archivos al VPS...${NC}"
echo "Esto puede tardar unos momentos..."

# Crear directorio en el VPS si no existe
ssh $VPS_HOST "sudo mkdir -p $VPS_PATH && sudo chown -R \$USER:\$USER $VPS_PATH"

# Subir archivos
scp -r dist/* $VPS_HOST:$VPS_PATH/

echo -e "${GREEN}✅ Archivos subidos correctamente${NC}"
echo ""

# Paso 4: Verificar Nginx
echo -e "${GREEN}🔍 Verificando Nginx...${NC}"
if ssh $VPS_HOST "sudo systemctl is-active --quiet nginx"; then
    echo -e "${GREEN}✅ Nginx está corriendo${NC}"
    
    # Recargar Nginx
    echo "Recargando configuración de Nginx..."
    ssh $VPS_HOST "sudo systemctl reload nginx"
    echo -e "${GREEN}✅ Nginx recargado${NC}"
else
    echo -e "${YELLOW}⚠️  Nginx no está corriendo${NC}"
    echo "Puedes iniciarlo con: ssh $VPS_HOST 'sudo systemctl start nginx'"
fi

echo ""
echo -e "${GREEN}🎉 ¡Despliegue completado!${NC}"
echo ""
echo "Tu aplicación debería estar disponible en: http://${VPS_HOST#*@}"
echo ""
echo "Para verificar el estado de Nginx:"
echo "  ssh $VPS_HOST 'sudo systemctl status nginx'"
echo ""
echo "Para ver los logs:"
echo "  ssh $VPS_HOST 'sudo tail -f /var/log/nginx/veritasfront-error.log'"

